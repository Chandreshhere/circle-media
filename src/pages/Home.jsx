import Hero from "../components/sections/Hero.jsx";
import Process from "../components/sections/Process.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import Tagline from "../components/sections/Tagline.jsx";
import WhatWeDo from "../components/sections/WhatWeDo.jsx";
import Services from "../components/sections/Services.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import CircleRing from "../components/sections/CircleRing.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Reveal />
      <Tagline />
      <WhatWeDo />
      <Services />
      <Testimonials />
      <CircleRing />
      <Footer />
    </>
  );
}
