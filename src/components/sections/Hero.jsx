import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import DynamicBackground from "../fx/DynamicBackground.jsx";
import { getLenis as getTrueLenis } from "../../App.jsx";

const HERO_SERVICES = [
  "social media marketing",
  "e-commerce listings & optimisation",
];

export default function Hero() {
  const copyRef = useRef(null);
  const [serviceIdx, setServiceIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setServiceIdx((i) => (i + 1) % HERO_SERVICES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const root = copyRef.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-hero-reveal]");
    gsap.set(items, { opacity: 0, y: 24, filter: "blur(14px)" });

    // Touch devices skip the scroll-lock entirely. The Hero entrance
    // animation still plays, but the user can scroll past it any time —
    // locking native scroll on phones is too risky (a stuck timeline or
    // missed onComplete leaves the page un-scrollable, with no recovery).
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth <= 900;

    const lenis = getTrueLenis();
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
    if (!isTouch) {
      window.addEventListener("wheel", block, { passive: false });
      window.addEventListener("touchmove", block, { passive: false });
      window.addEventListener("keydown", blockKeys, { passive: false });
    }

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      if (!isTouch) {
        window.removeEventListener("wheel", block);
        window.removeEventListener("touchmove", block);
        window.removeEventListener("keydown", blockKeys);
      }
      lenis?.start();
    };

    // The entrance animation now waits for the PageLoader to finish
    // before starting — `pageloader:done` event is dispatched as the
    // loader fades out. If the loader is already gone (e.g. fast nav
    // back to the home route), we start immediately. A 3.5s safety
    // timer also fires the start so we never sit invisible if the
    // event somehow doesn't arrive.
    let tl;
    let failsafe;

    const startEntrance = () => {
      if (tl) return;
      tl = gsap.timeline({ onComplete: unlock });
      tl.to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power2.out",
        stagger: 0.14,
      });
    };

    const onLoaderDone = () => {
      // Tiny delay so the Hero animation kicks in just as the loader
      // overlay finishes its fade-out, no perceptible gap.
      setTimeout(startEntrance, 80);
    };

    // If the loader isn't in the DOM (subsequent SPA navigation back to
    // home), or has already done its job, start right away.
    const loaderEl = document.querySelector(".page-loader");
    if (!loaderEl || loaderEl.classList.contains("is-done")) {
      startEntrance();
    } else {
      window.addEventListener("pageloader:done", onLoaderDone, { once: true });
      // Belt-and-suspenders: in case the loader event somehow never
      // fires (slow asset, errored fetch), force the entrance after
      // 3.5s so the hero never stays hidden indefinitely.
      failsafe = setTimeout(startEntrance, 3500);
    }

    // Always-on belt-and-suspenders for the unlock — even if onComplete
    // is missed, scroll is restored within 6s.
    const unlockSafety = setTimeout(unlock, 6000);

    return () => {
      window.removeEventListener("pageloader:done", onLoaderDone);
      if (failsafe) clearTimeout(failsafe);
      clearTimeout(unlockSafety);
      tl?.kill();
      unlock();
    };
  }, []);

  return (
    <section className="hero-split">
      <div className="hero-split-particles" aria-hidden="true">
        <DynamicBackground logoPath="/newlogo.png" bgColor="#050506" />
      </div>

      <div className="hero-split-content" ref={copyRef}>
        <p className="hero-split-eyebrow" data-hero-reveal>
          <span>[01]</span>
          <span className="hero-split-eyebrow-line" />
          <span>Circle — Est. 2019</span>
        </p>

        <h1 className="hero-split-title" data-hero-reveal>
          <span className="hero-split-title-lead">
            A digital marketing agency
            <br />
            specializing in
          </span>
          <span className="hero-split-accent">
            <span
              key={serviceIdx}
              className="hero-split-accent-text"
            >
              {HERO_SERVICES[serviceIdx]}
            </span>
          </span>
        </h1>

        <p className="hero-split-sub" data-hero-reveal>
          Content, community and performance — engineered to move the number
          that matters.
        </p>

        <p className="hero-split-scroll" data-hero-reveal>
          [Scroll to explore]
        </p>
      </div>
    </section>
  );
}
