import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// On iOS Safari and Android Chrome, the address bar grows/shrinks during
// scroll, which triggers a ScrollTrigger.refresh() and causes pinned/scrubbed
// sections to recalculate mid-scroll — the visible result is jitter and
// "bouncing". Telling ScrollTrigger to ignore those resizes is the single
// biggest mobile-stability win.
ScrollTrigger.config({ ignoreMobileResize: true });

// (Mobile pin smoothness is now handled by Lenis with smoothTouch; running
// ScrollTrigger.normalizeScroll on top of Lenis would double-smooth and
// felt sluggish, so it's intentionally not enabled here.)

import TopNav from "./components/TopNav.jsx";
import Transition from "./components/Transition.jsx";
import CursorFX from "./components/fx/CursorFX.jsx";

import Home from "./pages/Home.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import WorkPage from "./pages/WorkPage.jsx";
import WorkDetailPage from "./pages/WorkDetailPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

let lenisInstance = null;
export const getLenis = () => lenisInstance;

export default function App() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  // Mobile-only safety net: hard-reload sometimes leaves the body / html with
  // a stale lock (overflow:hidden from a previous mobile-menu open, or a
  // leftover `lenis-stopped` class from a prior desktop session served from
  // the same SW cache). On iOS this manifests as "scroll stuck after every
  // reload". Clear those once on mount, defensively, so native scroll is
  // guaranteed to work.
  useEffect(() => {
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth <= 900;
    if (!isTouch) return;
    document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.height = "";
    document.documentElement.style.overflow = "";
  }, []);

  useEffect(() => {
    // Lenis runs on every device now. Mobile uses `smoothTouch` so the
    // touch-driven scroll feels just as smooth as the desktop wheel scroll,
    // and pinned sections sample scroll through Lenis's RAF loop instead
    // of fighting native iOS momentum (which is what made earlier mobile
    // scroll feel jittery / inconsistent).
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth <= 900;

    let lastY = 0;
    let dirAnchor = 0;
    let currentDir = 0;
    const handleY = (y) => {
      const delta = y - lastY;
      lastY = y;
      if (y < 80) {
        document.body.classList.remove("chrome-hidden");
        dirAnchor = y;
        currentDir = 0;
        return;
      }
      if (Math.abs(delta) < 0.5) return;
      const dir = delta > 0 ? 1 : -1;
      if (dir !== currentDir) {
        currentDir = dir;
        dirAnchor = y;
      }
      const moved = Math.abs(y - dirAnchor);
      if (dir === 1 && moved > 90) {
        document.body.classList.add("chrome-hidden");
      } else if (dir === -1 && moved > 60) {
        document.body.classList.remove("chrome-hidden");
      }
    };

    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: isTouch,
      lerp: isTouch ? 0.12 : 0.09,
      duration: isTouch ? 0.9 : 1.05,
      wheelMultiplier: 1.05,
      touchMultiplier: isTouch ? 1.4 : 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisInstance = lenis;
    // Drive ScrollTrigger from Lenis so pinned sections actually freeze the
    // viewport — without this hook, ScrollTrigger reads the native scroll
    // (which Lenis has already intercepted) and pins drift.
    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", ({ scroll }) => handleY(scroll));
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
      document.body.classList.remove("chrome-hidden");
    };
  }, []);

  // Reset scroll BEFORE paint and before children mount their effects.
  // useLayoutEffect runs synchronously after DOM commit, so the new page's
  // BlurInText/Dissolve effects see scroll=0 when measuring rects.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true, force: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    // After paint: let Lenis recompute bounds for the new page, then refresh
    // ScrollTriggers so any newly-mounted ones evaluate against scroll=0.
    const id = requestAnimationFrame(() => {
      if (lenisInstance) {
        lenisInstance.resize();
        lenisInstance.scrollTo(0, { immediate: true, force: true });
      }
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <>
      <Transition pathname={location.pathname} />
      <CursorFX />
      <div className="app">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </>
  );
}
