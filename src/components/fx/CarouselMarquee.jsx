import { useState, useEffect, useRef } from "react";
import DragableCarousel from "./DragableCarousel.jsx";

const CAROUSELS = [
  {
    name: "Brand Carousel",
    cover: "/assets/work/carousels/1/Split-1.png",
    slides: Array.from({ length: 7 }, (_, i) => `/assets/work/carousels/1/Split-${i + 1}.png`),
  },
  {
    name: "Boba Bob",
    cover: "/assets/work/carousels/2/01.png",
    slides: Array.from({ length: 6 }, (_, i) => `/assets/work/carousels/2/${String(i + 1).padStart(2, "0")}.png`),
  },
  {
    name: "GDP: India vs Japan",
    cover: "/assets/work/carousels/3/01.png",
    slides: Array.from({ length: 9 }, (_, i) => `/assets/work/carousels/3/${String(i + 1).padStart(2, "0")}.png`),
  },
  {
    name: "Indore Metro Guide",
    cover: "/assets/work/carousels/4/01.png",
    slides: Array.from({ length: 10 }, (_, i) => `/assets/work/carousels/4/${String(i + 1).padStart(2, "0")}.png`),
  },
  {
    name: "Why Indore for Real Estate",
    cover: "/assets/work/carousels/5/01.png",
    slides: Array.from({ length: 9 }, (_, i) => `/assets/work/carousels/5/${String(i + 1).padStart(2, "0")}.png`),
  },
];

export default function CarouselMarquee() {
  const [open, setOpen] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Duplicate the items for seamless infinite loop
  const items = [...CAROUSELS, ...CAROUSELS];

  return (
    <>
      <div className="cm-marquee">
        <div className="cm-track" ref={trackRef}>
          {items.map((c, i) => (
            <button
              key={`${c.name}-${i}`}
              type="button"
              className="cm-card"
              onClick={() => setOpen(c)}
              aria-label={`Open ${c.name} carousel`}
            >
              <img
                src={c.cover}
                alt={c.name}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <span className="cm-card-label">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="cm-overlay"
          onClick={() => setOpen(null)}
        >
          <div
            className="cm-overlay-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cm-close"
              aria-label="Close carousel"
              onClick={() => setOpen(null)}
            >
              ×
            </button>
            <p className="cm-overlay-title">{open.name}</p>
            <DragableCarousel
              images={open.slides}
              slideWidth={Math.min(420, window.innerWidth * 0.85)}
              slideHeight={Math.min(525, window.innerHeight * 0.72)}
              gap={24}
              borderRadius={16}
              perspective={1200}
              rotateY={35}
              depth={140}
              activeScale={1}
              inactiveScale={0.8}
              inactiveOpacity={0.4}
              snapDuration={0.6}
              snapEase="power3.out"
              showArrows
              arrowColor="#fff"
              arrowSize={46}
              showDots
              dotColor="#fff"
              dotSize={8}
              loop
            />
          </div>
        </div>
      )}
    </>
  );
}
