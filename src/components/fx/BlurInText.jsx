import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function BlurInText({
  as: Tag = "h2",
  children,
  className = "",
  split = "words",
  stagger = 0.06,
  y = 40,
  blur = 18,
  start = "top 80%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = new SplitType(el, {
      types: split === "chars" ? "chars" : "words",
      wordClass: "bi-word",
      charClass: "bi-char",
    });
    const targets = split === "chars" ? s.chars : s.words;

    gsap.set(targets, {
      opacity: 0,
      y,
      filter: `blur(${blur}px)`,
      display: "inline-block",
      willChange: "transform, opacity, filter",
    });

    const trig = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger,
        });
      },
    });
    return () => {
      trig.kill();
      s.revert();
    };
  }, [split, stagger, y, blur, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
