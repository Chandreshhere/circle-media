import { useEffect, useRef, useState } from "react";

/* "Brands we've worked with" — categorised industry containers shown as a
   carousel: one industry visible at a time, sliding horizontally. Each
   container has a static coloured border (no scroll-driven trace anymore)
   and the strip auto-advances on a timer. Prev / next buttons + dot
   indicators give manual navigation. */

const indexedLogos = (slug, names, count) =>
  names.map((name, i) => ({
    name,
    logo: i < count ? `/logos/${slug}/${i + 1}.png` : null,
  }));

const BRAND_GROUPS = [
  {
    category: "FMCG",
    brands: indexedLogos(
      "fmcg",
      [
        "Madmix",
        "Conscious Food",
        "Zawaa",
        "The Indian Krunch",
        "Currygram",
        "Bamboosa",
        "The Coffee Clique",
        "Evora Greens",
        "Brew Saga",
      ],
      9
    ),
  },
  {
    category: "Home & Kitchen",
    brands: indexedLogos("home-kitchen", ["CamPure", "Whites of London"], 2),
  },
  {
    category: "Management",
    brands: indexedLogos(
      "management",
      [
        "Round Table India",
        "Indore Management Association",
        "Tushar Enterprises",
        "Evara Weddings",
        "FICCI Flo",
      ],
      5
    ),
  },
  {
    category: "Education",
    brands: indexedLogos("education", ["EC", "Investitute", "Exprto"], 3),
  },
  {
    category: "Fashion & Clothing",
    brands: indexedLogos(
      "fashion",
      ["Coloron Yarns", "Mr. Elite", "Shreeji Cotfab"],
      3
    ),
  },
  {
    category: "Personal Care",
    brands: indexedLogos(
      "personal-care",
      ["Terra Actives", "Park Avenue Beer Shampoo"],
      2
    ),
  },
  {
    category: "Hospitality",
    brands: indexedLogos(
      "hospitality",
      ["Adam's Ale", "Urban Theka", "Pro Brew Republic", "Granny's Omlette"],
      4
    ),
  },
  {
    category: "Real Estate",
    brands: indexedLogos(
      "real-estate",
      ["NM Group", "Swastik Habitates", "HFL"],
      3
    ),
  },
  {
    category: "Healthcare",
    brands: indexedLogos(
      "healthcare",
      ["Om Biomedic", "DNS Hospitals", "Regain"],
      3
    ),
  },
];

const totalBrands = BRAND_GROUPS.reduce((n, g) => n + g.brands.length, 0);

const TRACE_PALETTE = [
  "var(--c-blue)",
  "var(--c-pink)",
  "var(--c-yellow)",
  "var(--c-mint)",
  "var(--c-red)",
];

function BrandGroup({ group, color }) {
  // Split brands into exactly 2 rows so every category reads as a tidy
  // 2-line grid regardless of count (9, 5, 3, 2 …). Top row is the
  // ceiling-half so it's never shorter than the bottom row.
  const total = group.brands.length;
  const topCount = Math.ceil(total / 2);
  const topRow = group.brands.slice(0, topCount);
  const bottomRow = group.brands.slice(topCount);

  return (
    <div
      className="brand-group"
      style={{ "--trace-color": color, borderColor: color }}
    >
      <span className="brand-group-label">{group.category.toUpperCase()}</span>

      <div className="brand-group-grid">
        <div className="brand-group-row">
          {topRow.map((b) => (
            <div className="brand-circle" key={b.name} title={b.name}>
              {b.logo ? (
                <img src={b.logo} alt={b.name} loading="lazy" />
              ) : (
                <span className="brand-fallback">{b.name}</span>
              )}
            </div>
          ))}
        </div>
        {bottomRow.length > 0 && (
          <div className="brand-group-row">
            {bottomRow.map((b) => (
              <div className="brand-circle" key={b.name} title={b.name}>
                {b.logo ? (
                  <img src={b.logo} alt={b.name} loading="lazy" />
                ) : (
                  <span className="brand-fallback">{b.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Clients() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = BRAND_GROUPS.length;
  const intervalRef = useRef(null);

  const next = () => setActive((i) => (i + 1) % total);
  const prev = () => setActive((i) => (i - 1 + total) % total);

  // Auto-advance every 4.5s. Pauses while the user is hovering or has
  // touch-pressed the carousel; resets the interval on any manual nav so
  // the next auto-step doesn't fire too soon after a click.
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, 4500);
    return () => clearInterval(intervalRef.current);
  }, [paused, active, total]);

  // Touch / pointer swipe support — drag horizontally to step through.
  // Threshold is 40px so accidental vertical scroll attempts don't fire.
  const dragRef = useRef({ startX: 0, startY: 0, active: false });
  const onPointerDown = (e) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      active: true,
    };
  };
  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    // Only react to dominantly-horizontal swipes; vertical wins → leave it
    // to the native page scroll.
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
  };
  const onPointerCancel = () => {
    dragRef.current.active = false;
  };

  return (
    <section className="brands">
      <div className="brands-head">
        <p>[Brands we've worked with — {totalBrands}+]</p>
        <p>Circle ↻ 2018–2026</p>
      </div>

      <div
        className="brands-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{ touchAction: "pan-y" }}
      >
        <button
          type="button"
          className="brands-nav brands-prev"
          aria-label="Previous industry"
          onClick={prev}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 6 L9 12 L15 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="brands-viewport">
          <div
            className="brands-track"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {BRAND_GROUPS.map((group, gi) => (
              <div
                className={`brands-slide ${gi === active ? "is-active" : ""}`}
                key={group.category}
                aria-hidden={gi !== active}
              >
                <BrandGroup
                  group={group}
                  color={TRACE_PALETTE[gi % TRACE_PALETTE.length]}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="brands-nav brands-next"
          aria-label="Next industry"
          onClick={next}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 6 L15 12 L9 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="brands-dots" role="tablist" aria-label="Industries">
          {BRAND_GROUPS.map((g, i) => (
            <button
              key={g.category}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={g.category}
              className={`brands-dot ${i === active ? "is-active" : ""}`}
              style={{ "--dot-color": TRACE_PALETTE[i % TRACE_PALETTE.length] }}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
