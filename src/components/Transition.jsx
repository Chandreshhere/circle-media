import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Transition({ pathname }) {
  const ref = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    if (!ref.current) return;
    const blocks = ref.current.querySelectorAll(".block");
    if (first.current) {
      first.current = false;
      gsap.set(blocks, { scaleY: 1, transformOrigin: "top" });
      gsap.to(blocks, {
        scaleY: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: "power3.inOut",
        delay: 0.1,
      });
      return;
    }
    const tl = gsap.timeline();
    tl.set(blocks, { scaleY: 0, transformOrigin: "top" });
    tl.to(blocks, {
      scaleY: 1,
      duration: 0.45,
      stagger: 0.04,
      ease: "power3.inOut",
    });
    tl.set(blocks, { transformOrigin: "bottom" });
    tl.to(blocks, {
      scaleY: 0,
      duration: 0.45,
      stagger: 0.04,
      ease: "power3.inOut",
    });
  }, [pathname]);

  return (
    <div className="transition" ref={ref}>
      <div className="transition-row row-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="block" key={"a" + i}></div>
        ))}
      </div>
      <div className="transition-row row-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="block" key={"b" + i}></div>
        ))}
      </div>
    </div>
  );
}
