import Hero from "../components/sections/Hero.jsx";
import Process from "../components/sections/Process.jsx";
import Reveal from "../components/sections/Reveal.jsx";
import FeaturedWork from "../components/sections/FeaturedWork.jsx";
import Tagline from "../components/sections/Tagline.jsx";
import Clients from "../components/sections/Clients.jsx";
import Carousel from "../components/sections/Carousel.jsx";
import Stats from "../components/sections/Stats.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Reveal />
      <FeaturedWork />
      <Tagline />
      <Clients />
      <Carousel />
      <Stats />
      <Testimonials />
      <Footer />
    </>
  );
}
