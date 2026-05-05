import Hero from "../components/sections/Hero.jsx";
import Process from "../components/sections/Process.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import Tagline from "../components/sections/Tagline.jsx";
import WhatWeDo from "../components/sections/WhatWeDo.jsx";
import Services from "../components/sections/Services.jsx";
import AdsPartners from "../components/sections/AdsPartners.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import Clients from "../components/sections/Clients.jsx";
import Reach from "../components/sections/Reach.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Reveal />
      <Tagline />
      <WhatWeDo />
      {/* <Services /> */}
      <AdsPartners />
      <Testimonials />
      <Clients />
      <Reach />
      <Footer />
    </>
  );
}
