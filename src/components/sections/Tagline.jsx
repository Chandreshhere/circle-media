import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Tagline() {
  const rootRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const heading = headingRef.current;
    const root = rootRef.current;
    if (!heading || !root) return;

    const split = new SplitType(heading, {
      types: "words",
      wordClass: "tagline-word",
    });
    const words = split.words || [];

    const MAX_BLUR = 24;
    const MAX_Y = 30;
    const MAX_SCALE_OFFSET = 0.18;

    gsap.set(words, {
      opacity: 0,
      filter: `blur(${MAX_BLUR}px)`,
      y: MAX_Y,
      scale: 1 + MAX_SCALE_OFFSET,
      transformOrigin: "50% 50%",
    });

    const trig = ScrollTrigger.create({
      trigger: root,
      start: "top 95%",
      end: "center 60%",
      scrub: 0.4,
      onUpdate: (self) => {
        const progress = self.progress;
        const total = words.length;

        words.forEach((word, index) => {
          const wordProgress = index / total;
          const nextWordProgress = (index + 1) / total;

          let t = 0;
          if (progress >= nextWordProgress) {
            t = 1;
          } else if (progress >= wordProgress) {
            t =
              (progress - wordProgress) / (nextWordProgress - wordProgress);
          }

          const eased = t * t * (3 - 2 * t);

          gsap.to(word, {
            opacity: eased,
            filter: `blur(${(1 - eased) * MAX_BLUR}px)`,
            y: (1 - eased) * MAX_Y,
            scale: 1 + (1 - eased) * MAX_SCALE_OFFSET,
            duration: 0.25,
            ease: "power2.out",
            overwrite: true,
          });
        });
      },
    });

    return () => {
      trig.kill();
      split.revert();
    };
  }, []);

  return (
    <section className="tagline" ref={rootRef}>
      <div className="tagline-inner">
        <h2 ref={headingRef}>
          Circle the world with us. Build brands that compound,{" "}
          <em>season after season.</em>
        </h2>
      </div>
    </section>
  );
}
