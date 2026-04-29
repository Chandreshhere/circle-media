import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    // Mobile / touch devices skip Lenis entirely — native iOS Safari and
    // Android scroll is hardware-accelerated and significantly smoother
    // than a JS-driven smooth-scroll loop on phones. Lenis on touch is
    // what was producing the jitter, momentum lock, and pin desync.
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

    if (isTouch) {
      const onScroll = () => handleY(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        document.body.classList.remove("chrome-hidden");
      };
    }

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.09,
      duration: 1.05,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
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
