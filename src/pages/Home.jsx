import { lazy, Suspense } from "react";
import Hero from "../components/sections/Hero.jsx";
import Process from "../components/sections/Process.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import Tagline from "../components/sections/Tagline.jsx";
import WhatWeDo from "../components/sections/WhatWeDo.jsx";
import PlatformsWorkedWith from "../components/sections/PlatformsWorkedWith.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import Clients from "../components/sections/Clients.jsx";

/* Reach pulls in Three.js (~600KB) for the WebGL globe — too heavy to
   ship in the initial bundle. Footer is also deferred since it's well
   below the fold. The mid-page sections (Tagline → Clients) used to be
   lazy too, but pinned/scrubbed sections like Services + WhatWeDo were
   getting "skipped" on slower mobiles because the lazy import resolved
   AFTER the user had already scrolled past where the section should be —
   ScrollTrigger then created the pin too late and the user blew through
   empty space. They're synchronous now. */
const Reach        = lazy(() => import("../components/sections/Reach.jsx"));
const Footer       = lazy(() => import("../components/sections/Footer.jsx"));

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Reveal />
      <Tagline />
      <WhatWeDo />
      <PlatformsWorkedWith />
      <Testimonials />
      <Clients />
      <Suspense fallback={null}>
        <Reach />
        <Footer />
      </Suspense>
    </>
  );
}
