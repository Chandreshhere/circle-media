import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Transition({ pathname }) {
  const ref = useRef(null);
  const first = useRef(true);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const blocks = ref.current.querySelectorAll(".block");

    // Kill any in-flight timeline so a fast click can't strand the blocks
    // mid-cover (which would leave a white overlay over the new page).
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    if (first.current) {
      first.current = false;
      gsap.set(blocks, { scaleY: 1, transformOrigin: "top" });
      gsap.to(blocks, {
        scaleY: 0,
        duration: 0.35,
        stagger: 0.015,
        ease: "power3.out",
      });
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(blocks, { scaleY: 0 });
        tlRef.current = null;
      },
    });
    tlRef.current = tl;
    tl.set(blocks, { scaleY: 0, transformOrigin: "top" });
    tl.to(blocks, {
      scaleY: 1,
      duration: 0.22,
      stagger: 0.012,
      ease: "power3.in",
    });
    tl.set(blocks, { transformOrigin: "bottom" });
    tl.to(blocks, {
      scaleY: 0,
      duration: 0.22,
      stagger: 0.012,
      ease: "power3.out",
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
