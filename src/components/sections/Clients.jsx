import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* "Brands we've worked with" — categorised industry containers, each with a
   white static rounded border that visually "fills" with a per-container
   colour as the user scrolls. The colour starts at the top-centre (label)
   and races outward + down both sides simultaneously, hugging the rounded
   rectangle's path. Logos themselves are static (no animation). */

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

/* Sub-component for each industry container. Owns its own size observer +
   scroll-trigger so the SVG trace paths can hug the actual pixel dimensions
   of the container (including the rounded corners). The corner radius is
   read live from getComputedStyle so the SVG path matches whatever the CSS
   border-radius is at the current breakpoint. */
function BrandGroup({ group, color }) {
  const wrapRef = useRef(null);
  const rightPathRef = useRef(null);
  const leftPathRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0, r: 28 });

  // Track container dimensions + actual border-radius so the path always
  // matches the current rounded-rectangle outline at any breakpoint.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      const radius = parseFloat(cs.borderTopLeftRadius) || 28;
      setSize({ w: rect.width, h: rect.height, r: radius });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll-driven fill: stroke-dashoffset animates 100 → 0 (path "draws"
  // outward from top-centre along the rounded rectangle border) as the
  // container passes through the viewport.
  useEffect(() => {
    if (size.w === 0) return;
    const paths = [rightPathRef.current, leftPathRef.current].filter(Boolean);
    paths.forEach((p) => {
      p.style.strokeDasharray = "100";
      p.style.strokeDashoffset = "100";
    });

    const trig = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top 90%",
      end: "bottom 35%",
      scrub: 0.6,
      onUpdate: (self) => {
        const offset = (1 - self.progress) * 100;
        paths.forEach((p) => {
          if (p) p.style.strokeDashoffset = String(offset);
        });
      },
    });
    return () => trig.kill();
  }, [size.w, size.h]);

  const { w, h, r } = size;
  const valid = w > 0 && h > 2 * r;

  // Both paths begin at top-centre (where the label sits) and race outward.
  // Right path: top-center → top-right corner → right side → bottom-right
  // corner → bottom-center.
  // Left path:  top-center → top-left  corner → left  side → bottom-left
  // corner → bottom-center.
  const rightD = valid
    ? `M ${w / 2} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} ` +
      `V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${w / 2}`
    : "";
  const leftD = valid
    ? `M ${w / 2} 0 H ${r} A ${r} ${r} 0 0 0 0 ${r} ` +
      `V ${h - r} A ${r} ${r} 0 0 0 ${r} ${h} H ${w / 2}`
    : "";

  return (
    <div
      className="brand-group"
      ref={wrapRef}
      style={{ "--trace-color": color }}
    >
      {valid && (
        <svg
          className="brand-group-trace"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden="true"
        >
          <path
            ref={rightPathRef}
            d={rightD}
            pathLength="100"
            style={{ stroke: color }}
          />
          <path
            ref={leftPathRef}
            d={leftD}
            pathLength="100"
            style={{ stroke: color }}
          />
        </svg>
      )}

      <span className="brand-group-label">{group.category.toUpperCase()}</span>

      <div className="brand-group-grid">
        {group.brands.map((b) => (
          <div className="brand-circle" key={b.name} title={b.name}>
            {b.logo ? (
              <img src={b.logo} alt={b.name} loading="lazy" />
            ) : (
              <span className="brand-fallback">{b.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section className="brands">
      <div className="brands-head">
        <p>[Brands we've worked with — {totalBrands}+]</p>
        <p>Circle ↻ 2018–2026</p>
      </div>

      <div className="brands-stack">
        {BRAND_GROUPS.map((group, gi) => (
          <BrandGroup
            key={group.category}
            group={group}
            color={TRACE_PALETTE[gi % TRACE_PALETTE.length]}
          />
        ))}
      </div>
    </section>
  );
}
