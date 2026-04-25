import { useEffect, useRef } from "react";
import gsap from "gsap";
import DynamicBackground from "../fx/DynamicBackground.jsx";
import { getLenis } from "../../App.jsx";

export default function Hero() {
  const copyRef = useRef(null);

  useEffect(() => {
    const root = copyRef.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-hero-reveal]");
    gsap.set(items, { opacity: 0, y: 24, filter: "blur(14px)" });

    // Lock scroll until the hero entrance animation finishes. The site uses
    // Lenis for smooth scrolling, so CSS overflow:hidden alone won't stop
    // wheel/touch input — we have to call lenis.stop()/start(). Belt-and-
    // suspenders: also block native wheel/touchmove/keydown so anything
    // outside Lenis (e.g. browser scroll-restoration) can't sneak through.
    const lenis = getLenis();
    lenis?.stop();
    lenis?.scrollTo(0, { immediate: true, force: true });

    const block = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const SCROLL_KEYS = new Set([
      "ArrowUp", "ArrowDown", "PageUp", "PageDown",
      "Home", "End", "Space", " ",
    ]);
    const blockKeys = (e) => {
      if (SCROLL_KEYS.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys, { passive: false });

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
      lenis?.start();
    };

    const tl = gsap.timeline({ delay: 0.95, onComplete: unlock }); // wait out the page Transition
    tl.to(items, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.12,
    });
    return () => {
      tl.kill();
      unlock();
    };
  }, []);

  return (
    <section className="hero-split">
      <div className="hero-split-particles" aria-hidden="true">
        <DynamicBackground logoPath="/logoonly.png" bgColor="#050506" />
      </div>

      <div className="hero-split-content" ref={copyRef}>
        <p className="hero-split-eyebrow" data-hero-reveal>
          <span>[01]</span>
          <span className="hero-split-eyebrow-line" />
          <span>Circle — Est. 2019</span>
        </p>

        <h1 className="hero-split-title" data-hero-reveal>
          A digital marketing agency specializing in
          <span className="hero-split-accent"> social media.</span>
        </h1>

        <p className="hero-split-sub" data-hero-reveal>
          Content, community, influencer and performance — engineered to move
          the number that matters.
        </p>

        <p className="hero-split-scroll" data-hero-reveal>
          [Scroll to explore]
        </p>
      </div>
    </section>
  );
}
