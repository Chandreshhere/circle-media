import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import Nav from "./components/Nav.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import Transition from "./components/Transition.jsx";
import CursorFX from "./components/fx/CursorFX.jsx";

import Home from "./pages/Home.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import WorkPage from "./pages/WorkPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

let lenisInstance = null;
export const getLenis = () => lenisInstance;

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
    lenisInstance = lenis;
    // Drive ScrollTrigger from Lenis so pinned sections actually freeze the
    // viewport — without this hook, ScrollTrigger reads the native scroll
    // (which Lenis has already intercepted) and pins drift.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <>
      <Transition pathname={location.pathname} />
      <CursorFX />
      <div className="app">
        <Nav />
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </>
  );
}
