import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: "01",
    title: ["BRAND &", "CREATIVE"],
    copy: "We find your truth. Then define your brand identity and creative structure.",
    items: ["Strategy", "Narrative", "Direction"],
  },
  {
    id: "02",
    title: ["CAMPAIGN", "& FILM"],
    copy: "We tell stories that connect emotionally and perform commercially.",
    items: ["Concept", "Production", "Storytelling"],
  },
  {
    id: "03",
    title: ["VISUAL &", "EXPERIENTIAL"],
    copy: "We turn spaces into experiences you can feel.",
    items: ["Design", "Environments", "Merchandising"],
  },
  {
    id: "04",
    title: ["GROWTH &", "PARTNERSHIP"],
    copy: "We connect creativity with operations so ideas ship and don't die in a deck.",
    items: ["PR", "Process", "Procurement"],
  },
];

// Resting rotation/offset per card once it's landed in the stack — keeps the
// post-it-note feel with each card askew a little differently. x/y are in
// card-percent units added on top of the -50/-50 centering base.
const RESTING = [
  { rot: -4, x: -4, y: 2 },
  { rot: 3, x: 3, y: -1 },
  { rot: -2, x: -2, y: 3 },
  { rot: 2, x: 2, y: 0 },
];

export default function WhatWeDo() {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!root || cards.length === 0) return;

    // On touch we skip the pinned scroll-driven stack entirely. The cards
    // become a vertical flow (CSS handles via `.wwd-touch`), and a simple
    // fade-in plays as each enters view — no pin, no scrub.
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth <= 900;
    if (isTouch) {
      root.classList.add("wwd-touch");
      const trigs = cards.map((card) => {
        gsap.set(card, { autoAlpha: 0, y: 40 });
        return ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }),
        });
      });
      return () => trigs.forEach((t) => t.kill());
    }

    // Every card starts below the viewport. As the user scrolls, cards rise
    // one at a time — 01, then 02, 03, 04 — each landing slightly offset/
    // rotated behind the next. Base offset of -50/-50 percent keeps cards
    // centred against their top:50%/left:50% anchor.
    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: 150,
        rotation: RESTING[i].rot * 0.3,
      });
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: `+=${(cards.length + 1) * 100}%`,
        scrub: true,
        pin: true,
        pinType: "transform",
        pinSpacing: true,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, i) => {
      const rest = RESTING[i];
      tl.to(
        card,
        {
          xPercent: -50 + rest.x,
          yPercent: -50 + rest.y,
          rotation: rest.rot,
          duration: 1,
        },
        i
      );
    });

    // Hold the final frame for a beat so the full stack is visible before the
    // pin releases.
    tl.to({}, { duration: 0.5 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="wwd" ref={rootRef}>
      <div className="wwd-bg" aria-hidden="true">
        <span>WHAT</span>
        <span>WE</span>
        <span>DO</span>
      </div>

      <div className="wwd-stage">
        {CARDS.map((card, i) => (
          <article
            key={card.id}
            className="wwd-card"
            ref={(el) => (cardRefs.current[i] = el)}
            style={{ zIndex: 10 + i }}
          >
            <header className="wwd-card-title">
              {card.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </header>

            <p className="wwd-card-copy">{card.copy}</p>

            <div className="wwd-card-footer">
              <ul className="wwd-card-items">
                {card.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <span className="wwd-card-id">{card.id}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
