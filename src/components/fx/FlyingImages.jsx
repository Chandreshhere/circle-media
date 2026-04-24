import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax flying images — each image enters from a random offset
 * and drifts as the user scrolls through the section.
 */
export default function FlyingImages({ images = [], className = "" }) {
  const container = useRef(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const tiles = Array.from(el.querySelectorAll(".flyer"));

    const trigs = tiles.map((t, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      const xFrom = (i % 3 - 1) * 140;
      const yFrom = 120 * dir;
      gsap.set(t, {
        xPercent: xFrom,
        yPercent: yFrom,
        opacity: 0,
        rotate: (Math.random() - 0.5) * 14,
        filter: "blur(18px)",
      });
      const trig = ScrollTrigger.create({
        trigger: t,
        start: "top 95%",
        end: "bottom 5%",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(t, {
            xPercent: gsap.utils.interpolate(xFrom, 0, Math.min(1, p * 2)),
            yPercent: gsap.utils.interpolate(yFrom, -30 * dir, p),
            opacity: gsap.utils.interpolate(0, 1, Math.min(1, p * 3)),
            filter: `blur(${gsap.utils.interpolate(18, 0, Math.min(1, p * 3))}px)`,
            rotate: gsap.utils.interpolate(
              (Math.random() - 0.5) * 14,
              0,
              Math.min(1, p * 2)
            ),
          });
        },
      });
      return trig;
    });

    return () => trigs.forEach((t) => t.kill());
  }, [images]);

  return (
    <div ref={container} className={`flying-grid ${className}`}>
      {images.map((src, i) => (
        <div className="flyer" key={i}>
          <img src={src} alt="" loading="lazy" />
        </div>
      ))}
      <style>{`
        .flying-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          padding: 4rem 1.25rem;
        }
        .flying-grid .flyer {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          border: 1px solid var(--border);
          will-change: transform, opacity, filter;
        }
        @media (max-width: 820px) {
          .flying-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
