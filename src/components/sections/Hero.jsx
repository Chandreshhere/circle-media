import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "../../App.jsx";

gsap.registerPlugin(ScrollTrigger);

const floaterSources = [
  "/assets/hero/hero-1.jpg",
  "/assets/hero/hero-2.jpg",
  "/assets/hero/hero-3.jpg",
  "/assets/hero/hero-4.jpg",
  "/assets/carousel/main-1.jpg",
  "/assets/carousel/main-2.jpg",
  "/assets/carousel/main-3.jpg",
  "/assets/carousel/main-4.jpg",
];

// 8 positions in a ring. baseOffset is -π/2 so floater 0 starts at the TOP
// of the ring — together with a descent rotation that's a multiple of 360°
// this guarantees a floater sits at viewport centre when the ring pins.
const buildRing = () => {
  const count = 8;
  const baseOffset = -Math.PI / 2;
  const sizes = [165, 140, 175, 150, 160, 145, 170, 155];
  const drifts = [14, 10, 16, 12, 14, 11, 15, 13];
  const radiusVmin = 32;
  return Array.from({ length: count }, (_, i) => {
    const angle = baseOffset + (i * 2 * Math.PI) / count;
    return {
      src: floaterSources[i % floaterSources.length],
      x: Math.cos(angle) * radiusVmin, // vmin
      y: Math.sin(angle) * radiusVmin, // vmin
      size: sizes[i],
      drift: drifts[i],
      angle,
    };
  });
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const RING_PHASES = [
  "Create.",
  "Launch.",
  "Grow.",
  "Scale.",
  "Level up.",
];

export default function Hero() {
  const innerRef = useRef(null);
  const floatersRef = useRef(null);
  const ringRef = useRef(null);
  const ringTextRef = useRef(null);
  const floaters = useMemo(() => buildRing(), []);

  useEffect(() => {
    // entrance sequence:
    //   1. wait for the page transition to finish
    //   2. images spread out from the centre to their ring positions
    //   3. ring spins fast, then decelerates to a stop
    //   4. after it settles, scroll drives further rotation
    const nodes = floatersRef.current
      ? Array.from(floatersRef.current.querySelectorAll(".hero-floater"))
      : [];
    const ring = ringRef.current;

    const inner = innerRef.current;

    gsap.set(nodes, { "--spread": 0, opacity: 0, filter: "blur(18px)" });
    if (ring)
      gsap.set(ring, {
        "--ring-rot": 0,
        "--ring-scale": 1,
        "--ring-x": 0,
        "--ring-y": 0,
      });
    if (inner)
      gsap.set(inner, {
        "--copy-opacity": 1,
        "--expanse-opacity": 0,
      });

    // Start the "Create." phrase blurred + invisible — it sharpens into
    // focus in sync with the floaters spreading into the ring.
    if (ringTextRef.current)
      gsap.set(ringTextRef.current, {
        filter: "blur(28px)",
        opacity: 0,
      });

    // Lock scroll until the ring has finished forming. Lenis may not be
    // initialised yet at this point (child effects run before the parent
    // App's effect), so we use native event listeners as the primary lock
    // and also stop Lenis once it becomes available.
    const scrollKeys = new Set([
      " ",
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
    ]);
    const preventScroll = (e) => e.preventDefault();
    const preventScrollKeys = (e) => {
      if (scrollKeys.has(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);

    let lenisRafId = 0;
    const stopLenisWhenReady = () => {
      const l = getLenis();
      if (l) {
        l.stop();
        return;
      }
      lenisRafId = requestAnimationFrame(stopLenisWhenReady);
    };
    stopLenisWhenReady();

    const releaseScroll = () => {
      cancelAnimationFrame(lenisRafId);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
      const l = getLenis();
      if (l) l.start();
    };

    let scrollTrig;
    let pinTrig;
    const tl = gsap.timeline({ delay: 0.95 }); // wait for Transition

    tl.to(
      nodes,
      {
        "--spread": 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
        stagger: { amount: 0.5 },
      },
      0
    );

    if (ring) {
      tl.to(
        ring,
        {
          "--ring-rot": 720,
          duration: 2.4,
          ease: "power4.out",
        },
        0
      );
    }

    // Ring text blur-in — unfolds alongside the floater spread so the
    // phrase resolves in the centre as the ring finishes forming.
    if (ringTextRef.current) {
      tl.to(
        ringTextRef.current,
        {
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.6,
          ease: "power3.out",
        },
        0.2
      );
    }

    tl.call(() => {
      if (!ring) return;
      // Ring has finished forming — release the scroll lock.
      releaseScroll();
      const baseRot =
        parseFloat(getComputedStyle(ring).getPropertyValue("--ring-rot")) || 0;
      const phaseEls = ringTextRef.current
        ? Array.from(ringTextRef.current.querySelectorAll(".hero-ring-phase"))
        : [];
      let lastPhaseIdx = -1;
      scrollTrig = ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Scroll map across the 200vh hero:
          //   0.00 – 0.50  ring descends + spins + zooms into pinned state
          //   0.00 – 0.40  copy fades out
          //   0.10 – 0.25  "expanse" label fades in
          //   0.50 – 1.00  hero is pinned (pinSpacing:false). The ring stays
          //                at its settled scale/position but keeps spinning
          //                on scroll so the motion continues while the next
          //                section slides up over the pin.
          const pDescend = clamp01(p / 0.50);
          const pDescendEased = 1 - (1 - pDescend) * (1 - pDescend);
          const pCopyOut = clamp01(p / 0.40);
          const pExpanseIn = clamp01((p - 0.10) / 0.15);
          const pPostPin = clamp01((p - 0.50) / 0.50);

          // Descent rotates through 360°; once pinned the ring keeps turning
          // for another 360° over the pinned scroll range — continuous motion.
          ring.style.setProperty(
            "--ring-rot",
            String(baseRot + pDescend * 360 + pPostPin * 360)
          );
          ring.style.setProperty("--ring-scale", String(1 + pDescendEased * 1.6));
          ring.style.setProperty("--ring-x", "0");
          ring.style.setProperty("--ring-y", String(pDescendEased * 125));

          if (phaseEls.length && ringTextRef.current) {
            // Text is absolutely positioned at top:50% of .hero (200vh),
            // so its natural centre sits at document y = 100vh.
            //
            // Descent (p 0 → 0.50): user scrolls 0 → 100vh, yVh goes
            //   -50 → +100 (linear with scroll). Net visual motion is
            //   (translate Δ) − (scroll Δ) = 150 − 100 = +50vh, so the
            //   text slides from viewport centre (50vh) down to the
            //   viewport bottom (100vh).
            //
            // Pin (p 0.50 → 1.00): pDescend is clamped at 1, so yVh
            //   stays at +100 — the text's document y is frozen at
            //   200vh (the same spot where .process starts). From here
            //   pure scroll carries it, so .process rising from below
            //   pushes the text up to viewport top by scroll 200vh.
            const yVh = -50 + pDescend * 150;
            // Grows during descent, eases back a touch while it rides
            // the rising section so it reads as a header, not a splash.
            const textScale = 1 + pDescend * 1.4 - pPostPin * 0.6;
            // Shifts the anchor from the text's CENTRE (at scroll 0) toward
            // its VISIBLE baseline (at descent end and throughout the pin).
            // Using 0.5em*scale would land the element's BOX bottom on the
            // target, which leaves the glyphs floating ~0.2em*scale above
            // the line (cap text sits in the upper ~80% of the em box).
            // 0.35em*scale aims at the baseline itself so the phrase sits
            // exactly on .process's top edge.
            const shiftEm = pDescend * textScale * 0.02;
            ringTextRef.current.style.transform = `translate(-50%, calc(-50% + ${yVh}vh - ${shiftEm}em)) scale(${textScale})`;
            // Stays fully visible — no fade as it rides up with .process.
            ringTextRef.current.style.opacity = "1";
            const idx = Math.min(
              phaseEls.length - 1,
              Math.floor(pDescend * phaseEls.length)
            );
            if (idx !== lastPhaseIdx) {
              phaseEls.forEach((el, i) => {
                el.classList.toggle("is-active", i === idx);
              });
              lastPhaseIdx = idx;
            }
          }
          if (inner) {
            inner.style.setProperty("--copy-opacity", String(1 - pCopyOut));
            inner.style.setProperty("--expanse-opacity", String(pExpanseIn));
          }
        },
      });

      // Pin .hero-inner from the moment descent completes (50% of the 200vh
      // hero = 100vh scroll). With pinSpacing:false the pin adds no extra
      // scroll space, so sections further down the page continue to scroll
      // up naturally — they slide OVER the pinned hero because they appear
      // later in the DOM (section z-stacking) and have their own backgrounds.
      pinTrig = ScrollTrigger.create({
        trigger: ".hero",
        start: "top+=50% top",
        end: "bottom top",
        pin: ".hero-inner",
        pinSpacing: false,
        anticipatePin: 1,
      });
    });

    return () => {
      tl.kill();
      if (scrollTrig) scrollTrig.kill();
      if (pinTrig) pinTrig.kill();
      gsap.killTweensOf(nodes);
      if (ring) gsap.killTweensOf(ring);
      // Make sure scroll is restored if we unmount mid-entrance.
      releaseScroll();
    };
  }, []);

  return (
    <section className="hero">
      {/* Soft white halo centred on the hero/process boundary. Placed BEFORE
          .hero-inner in DOM and rendered inside .hero (not .process) so it
          paints below .process (z:2) — only the upper half leaks above
          Process's top edge, which reads as light coming from behind the
          rising section. */}
      <div className="hero-edge-glow" aria-hidden="true" />

      <div className="hero-inner" ref={innerRef}>
        <div className="hero-floaters" ref={floatersRef} aria-hidden="true">
          <div className="hero-ring" ref={ringRef}>
            {floaters.map((f, i) => {
              const isFeatured = i === 4;
              return (
                <div
                  key={i}
                  className={`hero-floater${isFeatured ? " hero-floater--featured" : ""}`}
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${f.size}px`,
                    height: `${f.size}px`,
                    "--tx": `${f.x}vmin`,
                    "--ty": `${f.y}vmin`,
                  }}
                >
                  <div className="hero-floater-inner">
                    <img src={f.src} alt="" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="wrapper">
          <div className="hero-footer">
            <div className="hero-copy">
              <h3>
                We build marketing ecosystems that compound — brand, content,
                performance and community, engineered to move the number that
                matters.
              </h3>
              <p>[Scroll to explore]</p>
            </div>
          </div>

          <div className="hero-expanse-label" aria-hidden="true">
            <span className="expanse-num">02</span>
            <span className="expanse-line" />
            <span className="expanse-title">Expanse</span>
          </div>
        </div>
      </div>

      {/* Ring text lives OUTSIDE .hero-inner so it isn't captured by the
          sticky element's stacking context. Its position is absolute
          within .hero (200vh tall), scroll-driven: starts at viewport
          centre, slides down to the bottom as the user scrolls the first
          100vh (descent), then rides at a fixed document-y so the rising
          .process section literally pushes it up the viewport during the
          pin. z-index wins over .process (z:2) so it paints on top. */}
      <div className="hero-ring-text" ref={ringTextRef} aria-hidden="true">
        {RING_PHASES.map((phrase, i) => (
          <span
            key={i}
            className={`hero-ring-phase${i === 0 ? " is-active" : ""}`}
          >
            {phrase}
          </span>
        ))}
      </div>
    </section>
  );
}
