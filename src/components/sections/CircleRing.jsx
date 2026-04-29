import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clients } from "../../data/content.js";

gsap.registerPlugin(ScrollTrigger);

const RING_COUNT = 8;

const buildRing = () => {
  const baseOffset = -Math.PI / 2;
  const sizes = [165, 140, 175, 150, 160, 145, 170, 155];
  const radiusVmin = 30;
  return Array.from({ length: RING_COUNT }, (_, i) => {
    const angle = baseOffset + (i * 2 * Math.PI) / RING_COUNT;
    return {
      x: Math.cos(angle) * radiusVmin,
      y: Math.sin(angle) * radiusVmin,
      size: sizes[i],
    };
  });
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const TEXT_INTRO = "Brands we've worked with.";
const TEXT_OUTRO = "Reach out — work with us.";
const TEXT_SWITCH_AT = 0.55;

export default function CircleRing() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const ringRef = useRef(null);
  const floatersRef = useRef(null);
  const textRef = useRef(null);
  const [phaseId, setPhaseId] = useState("intro");
  const [brandTick, setBrandTick] = useState(0);
  const floaters = useMemo(() => buildRing(), []);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!section || !inner || !ring || !text) return;

    const nodes = Array.from(
      floatersRef.current.querySelectorAll(".cring-floater")
    );

    // Floaters always render at their full orbit position. The earlier
    // bunch-to-spread intro (animating --spread from 0→1) was unreliable on
    // iOS Safari — calc() of a length × an animated unitless var inside the
    // standalone `translate` property could silently fail, leaving every
    // floater stacked at centre. Now we only fade them in.
    gsap.set(nodes, { opacity: 0, filter: "blur(18px)" });
    gsap.set(ring, {
      "--ring-rot": 0,
      "--ring-rot-auto": 0,
      "--ring-scale": 1,
      "--ring-y": 0,
    });

    // Autonomous baseline spin — runs independently of scroll so the ring
    // never appears to stop, even when the user pauses scrolling. Layered
    // additively with the scroll-driven --ring-rot in CSS.
    const autoSpin = gsap.to(ring, {
      "--ring-rot-auto": 360,
      duration: 22,
      ease: "none",
      repeat: -1,
      modifiers: {
        "--ring-rot-auto": (v) => `${parseFloat(v) % 360}`,
      },
    });

    // Entrance: floaters spread, ring spins up. Plays once when section enters.
    const intro = gsap.timeline({ paused: true });
    intro
      .to(
        nodes,
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
          stagger: { amount: 0.5 },
        },
        0
      )
      .to(
        ring,
        { "--ring-rot": 360, duration: 3.0, ease: "power4.out" },
        0
      );

    const introTrig = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => intro.play(),
    });

    // Scrub matches the pin: it spans 260vh of scroll (100vh of descent +
    // 160vh of pinned/footer-overlap). The descent's progress reaches 1 at
    // ~38% of total scroll; the rest drives a linear rotation so the ring
    // keeps spinning at a steady pace while the footer rises.
    const baseRot = 360;
    const TOTAL_SCROLL_FACTOR = 2.6;
    const DESCENT_FRAC = 1 / TOTAL_SCROLL_FACTOR; // 100/260
    let lastPhase = "intro";

    // GSAP pin is desktop-only. On touch the inner is already pinned by
    // `position: sticky` in the CSS — adding a second pin via transform
    // fights with native scroll on iOS, causing the "footer locked" /
    // "can't scroll up" symptoms users were reporting.
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth <= 900;

    // On mobile we also skip the scroll-driven scrub: dragging --ring-y /
    // --ring-scale on every scroll frame is what made the logo appear to
    // "fall" / jump downward on every touch. The intro animation still plays
    // and the autospin keeps the ring lively, just without the descent.
    let scrollTrig = null;
    if (!isTouch) {
      scrollTrig = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * TOTAL_SCROLL_FACTOR}`,
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const pDescend = clamp01(p / DESCENT_FRAC);
          const pDescendEased = 1 - (1 - pDescend) * (1 - pDescend);
          const pPostPin = clamp01((p - DESCENT_FRAC) / (1 - DESCENT_FRAC));

          ring.style.setProperty(
            "--ring-rot",
            String(baseRot + pDescend * 360 + pPostPin * 720)
          );
          ring.style.setProperty(
            "--ring-scale",
            String(1 + pDescendEased * 1.4)
          );
          ring.style.setProperty("--ring-y", String(pDescendEased * 90));

          const yVh = -50 + pDescend * 150;
          text.style.transform = `translate(-50%, calc(-50% + ${yVh}vh))`;

          const phase = p > TEXT_SWITCH_AT ? "outro" : "intro";
          if (phase !== lastPhase) {
            lastPhase = phase;
            setPhaseId(phase);
          }
        },
      });
    }

    let pinTrig = null;
    if (!isTouch) {
      pinTrig = ScrollTrigger.create({
        trigger: section,
        start: "top+=50% top",
        end: () => `+=${window.innerHeight * 1.6}`,
        pin: inner,
        pinType: "transform",
        pinSpacing: false,
        anticipatePin: 1,
      });
    }

    return () => {
      introTrig.kill();
      if (scrollTrig) scrollTrig.kill();
      if (pinTrig) pinTrig.kill();
      intro.kill();
      autoSpin.kill();
    };
  }, []);

  // Cycle the brand assigned to each circle so logos shuffle as the ring spins.
  useEffect(() => {
    const id = setInterval(() => {
      setBrandTick((t) => (t + 1) % clients.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="cring" ref={sectionRef}>
      <div className="cring-inner" ref={innerRef}>
        <div className="cring-floaters" ref={floatersRef} aria-hidden="true">
          <div className="cring-ring" ref={ringRef}>
            {floaters.map((f, i) => {
              const brand = clients[(brandTick + i) % clients.length];
              return (
                <div
                  key={i}
                  className="cring-floater"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: `${f.size}px`,
                    height: `${f.size}px`,
                    "--tx": `${f.x}vmin`,
                    "--ty": `${f.y}vmin`,
                  }}
                >
                  <div className="cring-floater-inner">
                    <img
                      key={brand.logo}
                      src={brand.logo}
                      alt={brand.name}
                      className="cring-brand-img"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Text lives OUTSIDE .cring-inner so it isn't captured by the pin's
          stacking context. Absolute within .cring (200vh) with high z-index
          so it paints over the rising .footer (z:2). The transform driven
          in onUpdate slides it down with the ring, then keeps it at a fixed
          document-y so the footer scrolls under it. */}
      <div className="cring-text" ref={textRef} aria-hidden="true">
        <span
          className={`cring-phase${phaseId === "intro" ? " is-active" : ""}`}
        >
          {TEXT_INTRO}
        </span>
        <span
          className={`cring-phase${phaseId === "outro" ? " is-active" : ""}`}
        >
          {TEXT_OUTRO}
        </span>
      </div>
    </section>
  );
}
