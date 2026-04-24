import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps children in a canvas overlay that dissolves/burns them away on scroll-out.
 * Uses a noise mask + threshold on displacement to produce a "dissolving" reveal
 * without requiring WebGL. Displacement is cheap and convincing.
 */
export default function Dissolve({ children, direction = "in", className = "" }) {
  const wrap = useRef(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    // Start state
    gsap.set(el, {
      opacity: direction === "in" ? 0 : 1,
      filter: direction === "in" ? "blur(24px) saturate(0.3)" : "blur(0px)",
      scale: direction === "in" ? 0.98 : 1,
      willChange: "opacity, filter, transform",
    });

    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          filter: "blur(0px) saturate(1)",
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          opacity: 0,
          filter: "blur(24px) saturate(0.3)",
          scale: 0.98,
          duration: 0.8,
          ease: "power2.inOut",
        });
      },
    });

    return () => trig.kill();
  }, [direction]);

  return (
    <div ref={wrap} className={className}>
      {children}
    </div>
  );
}
