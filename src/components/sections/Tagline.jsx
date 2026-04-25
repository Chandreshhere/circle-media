import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARALLAX_IMAGES = [
  { src: "/assets/socials/whatsapp.jpeg", cls: "tagline-img tagline-img-1", speed: -90 },
  { src: "/assets/socials/twitter-x.jpeg", cls: "tagline-img tagline-img-2", speed: 70 },
  { src: "/assets/socials/snapchat.jpeg", cls: "tagline-img tagline-img-3", speed: -130 },
  { src: "/assets/socials/facebook.jpeg", cls: "tagline-img tagline-img-4", speed: 110 },
];

export default function Tagline() {
  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    const heading = headingRef.current;
    if (!root || !heading) return;

    heading.style.setProperty("--fill", "0%");

    const fillTrig = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      end: "bottom 55%",
      scrub: 0.6,
      onUpdate: (self) => {
        heading.style.setProperty("--fill", `${self.progress * 100}%`);
      },
    });

    const imgTrigs = imagesRef.current.map((el) => {
      if (!el) return null;
      const speed = Number(el.dataset.speed || 0);
      return gsap.to(el, {
        y: speed,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      fillTrig.kill();
      imgTrigs.forEach((t) => t?.scrollTrigger?.kill());
    };
  }, []);

  return (
    <section className="tagline" ref={rootRef}>
      <div className="tagline-bg" aria-hidden="true" />

      {PARALLAX_IMAGES.map((img, i) => (
        <div
          key={i}
          className={img.cls}
          data-speed={img.speed}
          ref={(el) => (imagesRef.current[i] = el)}
        >
          <img src={img.src} alt="" />
        </div>
      ))}

      <div className="tagline-inner">
        <h2 ref={headingRef} className="tagline-heading">
          We offer tailored social media services to boost your online presence and engagement. Our expertise includes content creation, account management, and{" "}
          <span className="tagline-accent">data-driven strategies.</span>{" "}
          This will increase brand growth, traffic, and conversions.
        </h2>
      </div>
    </section>
  );
}
