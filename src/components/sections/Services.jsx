import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { services } from "../../data/content.js";
import ShaderBackground from "../fx/ShaderBackground.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const items = Array.from(el.querySelectorAll(".service"));
    const splits = [];

    items.forEach((item) => {
      const titleSplit = new SplitType(item.querySelector(".title h3"), {
        types: "chars",
        charClass: "char",
      });
      const copySplit = new SplitType(item.querySelector(".copy p"), {
        types: "lines",
        lineClass: "line",
      });
      splits.push(titleSplit, copySplit);

      gsap.set(item.querySelectorAll(".char"), {
        opacity: 0,
        y: 20,
        filter: "blur(14px)",
        display: "inline-block",
        willChange: "transform, opacity, filter",
      });
      gsap.set(item.querySelectorAll(".line"), {
        opacity: 0,
        y: 24,
        filter: "blur(10px)",
        willChange: "transform, opacity, filter",
      });
      gsap.set(item.querySelector(".index"), { opacity: 0 });

      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(item.querySelector(".index"), {
            opacity: 1,
            duration: 0.5,
          });
          gsap.to(item.querySelectorAll(".char"), {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: { amount: 0.4 },
            ease: "power3.out",
          });
          gsap.to(item.querySelectorAll(".line"), {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: { amount: 0.25 },
            delay: 0.15,
            ease: "power3.out",
          });
        },
      });
    });

    return () => {
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section className="services" ref={root}>
      <ShaderBackground
        colorA={[0.015, 0.015, 0.02]}
        colorB={[0.08, 0.05, 0.15]}
        intensity={0.6}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="section-label"
          style={{ maxWidth: 1400, margin: "0 auto 4rem", padding: "0 0" }}
        >
          <p>[Services]</p>
          <p>What we do</p>
        </div>
        <div className="wrapper">
          {services.map((s) => (
            <div className="service" key={s.id}>
              <div className="index"><p>[{s.id}]</p></div>
              <div className="title"><h3>{s.title}</h3></div>
              <div className="copy"><p>{s.copy}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
