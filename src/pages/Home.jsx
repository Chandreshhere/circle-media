import { lazy, Suspense } from "react";
import Hero from "../components/sections/Hero.jsx";
import Process from "../components/sections/Process.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import Tagline from "../components/sections/Tagline.jsx";
import WhatWeDo from "../components/sections/WhatWeDo.jsx";
import Services from "../components/sections/Services.jsx";
import AdsPartners from "../components/sections/AdsPartners.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import Clients from "../components/sections/Clients.jsx";

/* Reach pulls in Three.js for the globe — easily 600KB+ of JS. Lazy-load
   it so the initial bundle on Windows / slow connections doesn't choke
   on parsing it before anything else paints. Footer is also deferred
   since it's well below the fold. */
const Reach = lazy(() => import("../components/sections/Reach.jsx"));
const Footer = lazy(() => import("../components/sections/Footer.jsx"));

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Reveal />
      <Tagline />
      <WhatWeDo />
      <Services />
      <AdsPartners />
      <Testimonials />
      <Clients />
      <Suspense fallback={null}>
        <Reach />
        <Footer />
      </Suspense>
    </>
  );
}
