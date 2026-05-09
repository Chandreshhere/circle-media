import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Real WebGL globe — wireframe + dotted earth surface, glowing pins on the
   served countries, auto-rotates continuously, and supports pointer / touch
   drag to rotate manually. Drag inertia carries the spin a little after
   release before easing back to the constant idle rotation. */

// Pin positions tuned for VISUAL spread on the rendered globe — not just
// the geographic centroid of each country. India sits in the south so it
// reads clearly below Dubai; USA is anchored on the east coast (NY) and
// Canada on the west coast (Vancouver), so the two North-American pins
// are diagonally across the continent instead of stacked over each other.
const PINS = [
  { lat: 12.97,  lon: 77.59,   label: "India"  },   // Bangalore
  { lat: 25.20,  lon: 55.27,   label: "Dubai"  },   // Dubai
  { lat: 40.71,  lon: -74.00,  label: "USA"    },   // New York
  { lat: 49.28,  lon: -123.12, label: "Canada" },   // Vancouver
];

const latLonToVec3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
};

export default function GlobeWebGL() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getSize = () => ({
      w: mount.clientWidth || 400,
      h: mount.clientHeight || 400,
    });

    let { w, h } = getSize();

    const scene = new THREE.Scene();
    // Wider vertical FOV + slightly further camera so the lifted flight
    // arcs (mid-points pushed out to ~2.2× the planet radius) sit fully
    // inside the camera frustum instead of being clipped at the top of
    // the canvas. The taller canvas aspect (3:4) then renders that
    // headroom as visible canvas space above the planet.
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
    camera.position.z = 6.4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Container group — drag rotation applies to this so pins spin with the
    // surface and stay stuck to their lat/lon.
    const group = new THREE.Group();
    scene.add(group);

    const radius = 1.7;

    // Solid filled sphere (the planet's "body") — slightly inset so dots /
    // pins read as raised on its surface.
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.985, 64, 48),
      new THREE.MeshBasicMaterial({
        color: 0x0a0a0e,
        transparent: true,
        opacity: 0.92,
      })
    );
    group.add(planet);

    // Wireframe — latitude / longitude grid. Bumped opacity so the lines
    // read clearly, not just an implied grid behind the dots.
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(radius, 36, 24)),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
      })
    );
    group.add(wire);

    // Equator + tropics as bolder standalone rings so the planet has a
    // clear horizon line and a couple of "banding" cues.
    const ringRefs = [];
    const addRing = (latDeg, opacity, colour) => {
      const points = [];
      const segs = 96;
      const r = radius * 1.001;
      const phi = (90 - latDeg) * (Math.PI / 180);
      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            -r * Math.sin(phi) * Math.cos(theta),
             r * Math.cos(phi),
             r * Math.sin(phi) * Math.sin(theta)
          )
        );
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({
          color: colour,
          transparent: true,
          opacity,
        })
      );
      group.add(ring);
      ringRefs.push(ring);
    };
    addRing(0,    0.55, 0xffffff); // equator
    addRing(23,   0.30, 0xffffff); // tropic of cancer
    addRing(-23,  0.30, 0xffffff); // tropic of capricorn

    // Vertical meridians (every 30°) — visible longitude lines.
    const meridianRefs = [];
    for (let m = 0; m < 12; m++) {
      const lonDeg = -180 + m * 30;
      const points = [];
      const segs = 64;
      const r = radius * 1.001;
      for (let i = 0; i <= segs; i++) {
        const lat = -90 + (180 * i) / segs;
        points.push(latLonToVec3(lat, lonDeg, r));
      }
      const meridianGeo = new THREE.BufferGeometry().setFromPoints(points);
      const meridian = new THREE.Line(
        meridianGeo,
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.18,
        })
      );
      group.add(meridian);
      meridianRefs.push(meridian);
    }

    // Dot grid covering the globe. Resolution dropped much further so
    // each white dot sits clearly apart from its neighbours — the
    // planet reads as a sparse constellation of points rather than a
    // textured surface. Each dot is also a touch larger and brighter to
    // compensate for the lower density.
    const dotPositions = [];
    const N_LAT = 16;
    for (let i = 1; i < N_LAT; i++) {
      const lat = -90 + (180 * i) / N_LAT;
      const numLon = Math.max(
        3,
        Math.round(2 * Math.PI * Math.cos((lat * Math.PI) / 180) * 5)
      );
      for (let j = 0; j < numLon; j++) {
        const lon = -180 + (360 * j) / numLon;
        const v = latLonToVec3(lat, lon, radius * 1.005);
        dotPositions.push(v.x, v.y, v.z);
      }
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dotPositions, 3)
    );
    const dots = new THREE.Points(
      dotsGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
      })
    );
    group.add(dots);

    // Atmosphere — outer translucent shell to suggest a soft glow.
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.06, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x88aaff,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide,
      })
    );
    group.add(atmosphere);

    // Country pins — bigger, more saturated pink spheres with two halo
    // rings so each marker reads clearly against the sparser dot grid.
    const PIN_PINK = 0xff3d7f;
    const pinObjs = [];
    PINS.forEach((p) => {
      const pos = latLonToVec3(p.lat, p.lon, radius * 1.015);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 24, 24),
        new THREE.MeshBasicMaterial({ color: PIN_PINK })
      );
      dot.position.copy(pos);
      group.add(dot);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 24, 24),
        new THREE.MeshBasicMaterial({
          color: PIN_PINK,
          transparent: true,
          opacity: 0.4,
        })
      );
      halo.position.copy(pos);
      group.add(halo);

      // Outer ring picks up the pulse animation in the render loop and
      // gives the marker an actively-pinging look.
      const halo2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 20, 20),
        new THREE.MeshBasicMaterial({
          color: PIN_PINK,
          transparent: true,
          opacity: 0.18,
        })
      );
      halo2.position.copy(pos);
      group.add(halo2);

      pinObjs.push({ dot, halo, halo2, basePos: pos.clone() });
    });

    // Connection arcs — solid pink lines from the home pin (India) to
    // every other served country. Midpoints are lifted off the surface
    // so each arc sweeps high above the planet rather than hugging it.
    const arcRefs = [];
    const home = pinObjs[0].basePos;
    pinObjs.slice(1).forEach((target) => {
      const a = home;
      const b = target.basePos;
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const liftFactor = 1.55 + 0.7 * (a.distanceTo(b) / (radius * 2));
      mid.normalize().multiplyScalar(radius * liftFactor);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const points = curve.getPoints(64);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arc = new THREE.Line(
        arcGeo,
        new THREE.LineBasicMaterial({
          color: PIN_PINK,
          transparent: true,
          opacity: 0.95,
        })
      );
      group.add(arc);
      arcRefs.push(arc);
    });

    // ---- Interaction: drag rotates the group, idle spin always present ----
    let isDragging = false;
    let lastX = 0,
      lastY = 0;
    let velX = 0, // x-axis pitch velocity from drag inertia
      velY = 0; // y-axis yaw velocity from drag inertia
    const IDLE_SPIN = 0.0028;
    const DAMP = 0.94;
    const SENSITIVITY = 0.005;

    group.rotation.y = 0.6; // start with a flattering view of Asia / India

    const onPointerDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      mount.style.cursor = "grabbing";
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch {/* ignore */}
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      group.rotation.y += dx * SENSITIVITY;
      group.rotation.x += dy * SENSITIVITY;
      // clamp pitch so the user can't flip the globe upside-down
      group.rotation.x = Math.max(
        -Math.PI / 2.4,
        Math.min(Math.PI / 2.4, group.rotation.x)
      );

      velY = dx * SENSITIVITY;
      velX = dy * SENSITIVITY;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      mount.style.cursor = "grab";
      try {
        e.target.releasePointerCapture?.(e.pointerId);
      } catch {/* ignore */}
    };

    mount.style.cursor = "grab";
    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // ---- Resize ----
    const onResize = () => {
      const sz = getSize();
      w = sz.w;
      h = sz.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---- Animation loop ----
    /* PERF: pause the loop when the canvas is off-screen. The globe
       used to spin its rAF (Three.js render + halo pulse + matrix
       updates) every frame regardless of where the user was on the
       page — a constant CPU/GPU drain that contributed to the rest
       of the page jittering on mobile. IntersectionObserver gates
       the rAF so it only ticks while in view, with a 200px margin so
       the scene is rendered before the user actually sees it. */
    let raf;
    let t = 0;
    let inView = false;
    const animate = () => {
      t += 1;

      if (!isDragging) {
        // Inertia from drag fades, idle yaw spin always continues.
        group.rotation.y += IDLE_SPIN + velY;
        group.rotation.x += velX;
        velX *= DAMP;
        velY *= DAMP;
        // Pitch eases back toward 0 so the camera doesn't end stuck off-axis.
        group.rotation.x *= 0.985;
      }

      // Pin halo pulse — gentle scale breathing on the inner halo, plus a
      // wider outward ping on the outer halo so the marker visibly throbs.
      const pulse = 1 + Math.sin(t * 0.04) * 0.22;
      const ping = 1 + (Math.sin(t * 0.05) * 0.5 + 0.5) * 0.6;
      pinObjs.forEach((pin, i) => {
        const phase = pulse + (i % 2) * 0.05;
        pin.halo.scale.setScalar(phase);
        pin.halo2.scale.setScalar(ping + (i % 2) * 0.08);
        pin.halo2.material.opacity =
          0.22 - (Math.sin(t * 0.05) * 0.5 + 0.5) * 0.18;
      });

      renderer.render(scene, camera);
      if (inView) raf = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const wasInView = inView;
        inView = entry.isIntersecting;
        if (inView && !wasInView) {
          raf = requestAnimationFrame(animate);
        } else if (!inView && wasInView) {
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(mount);
    // Initial render (one frame) so the globe is painted immediately
    // when first scrolled into view, even before the IO callback fires.
    renderer.render(scene, camera);

    return () => {
      io.disconnect();
      inView = false;
      cancelAnimationFrame(raf);
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);

      // Dispose every geometry / material to release GPU memory.
      planet.geometry.dispose();
      planet.material.dispose();
      wire.geometry.dispose();
      wire.material.dispose();
      dotsGeo.dispose();
      dots.material.dispose();
      atmosphere.geometry.dispose();
      atmosphere.material.dispose();
      pinObjs.forEach(({ dot, halo, halo2 }) => {
        dot.geometry.dispose();
        dot.material.dispose();
        halo.geometry.dispose();
        halo.material.dispose();
        halo2.geometry.dispose();
        halo2.material.dispose();
      });
      ringRefs.forEach((r) => {
        r.geometry.dispose();
        r.material.dispose();
      });
      meridianRefs.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      arcRefs.forEach((a) => {
        a.geometry.dispose();
        a.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="reach-globe-3d" ref={mountRef} aria-hidden="true" />;
}
