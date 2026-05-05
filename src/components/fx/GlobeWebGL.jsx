import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Real WebGL globe — wireframe + dotted earth surface, glowing pins on the
   served countries, auto-rotates continuously, and supports pointer / touch
   drag to rotate manually. Drag inertia carries the spin a little after
   release before easing back to the constant idle rotation. */

const PINS = [
  { lat: 20.5937, lon: 78.9629,  label: "India" },
  { lat: 25.2048, lon: 55.2708,  label: "UAE" },
  { lat: 37.0902, lon: -95.7129, label: "USA" },
  { lat: 23.8859, lon: 45.0792,  label: "Saudi Arabia" },
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
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.z = 5.2;

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

    // Dot grid covering the globe — gives the digital-earth aesthetic.
    const dotPositions = [];
    const N_LAT = 44;
    for (let i = 1; i < N_LAT; i++) {
      const lat = -90 + (180 * i) / N_LAT;
      const numLon = Math.max(
        4,
        Math.round(2 * Math.PI * Math.cos((lat * Math.PI) / 180) * 14)
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
        size: 0.022,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
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

    // Country pins — small bright spheres + a billboard ring for "presence".
    const pinObjs = [];
    PINS.forEach((p) => {
      const pos = latLonToVec3(p.lat, p.lon, radius * 1.012);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xff5577 })
      );
      dot.position.copy(pos);
      group.add(dot);

      // Halo — slightly larger faint sphere around the pin.
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 20, 20),
        new THREE.MeshBasicMaterial({
          color: 0xff5577,
          transparent: true,
          opacity: 0.25,
        })
      );
      halo.position.copy(pos);
      group.add(halo);

      pinObjs.push({ dot, halo, basePos: pos.clone() });
    });

    // Connection arcs — curved "flight path" lines from the home pin
    // (India) to every other served country, lifted above the chord so
    // each reads as an arc, not a straight line through the planet.
    const arcRefs = [];
    const home = pinObjs[0].basePos;
    pinObjs.slice(1).forEach((target) => {
      const a = home;
      const b = target.basePos;
      const mid = a.clone().add(b).multiplyScalar(0.5);
      // Lift the midpoint outward — height proportional to chord length so
      // long-distance arcs rise higher than short ones.
      const liftFactor = 1.18 + 0.45 * (a.distanceTo(b) / (radius * 2));
      mid.normalize().multiplyScalar(radius * liftFactor);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const points = curve.getPoints(48);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arc = new THREE.Line(
        arcGeo,
        new THREE.LineBasicMaterial({
          color: 0xff7a3d,        // accent orange
          transparent: true,
          opacity: 0.78,
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
    let raf;
    let t = 0;
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

      // Pin halo pulse — gentle scale breathing.
      const pulse = 1 + Math.sin(t * 0.04) * 0.18;
      pinObjs.forEach((pin, i) => {
        const phase = pulse + (i % 2) * 0.04;
        pin.halo.scale.setScalar(phase);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
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
      pinObjs.forEach(({ dot, halo }) => {
        dot.geometry.dispose();
        dot.material.dispose();
        halo.geometry.dispose();
        halo.material.dispose();
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
