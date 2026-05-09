import { useEffect, useRef, useState } from "react";

/* "Brands we've worked with" — Apple-Watch-style honeycomb of circular logos.
   Section scrolls naturally (no pin, no scroll-jack). Each icon's scale +
   opacity is driven by its distance from the viewport centre, so icons grow
   as they pass through the middle of the screen — the fish-eye effect from
   the watchOS home screen. Hover smoothly enlarges any single icon. */

// User-specified order at the top (most well-known brands first), then the
// rest in a deliberately mixed order so no single category clusters.
const BRANDS = [
  // Adam's Ale moved up to lead line 1; DNS Hospitals slides one slot
  // down behind it. Line 2's first orb (was Conscious Food) is now
  // Pro Brew Republic — Conscious Food drops into the mid-list.
  { name: "Adam's Ale",                   logo: "/logos/hospitality/1.png" },
  { name: "DNS Hospitals",                logo: "/logos/healthcare/2.png" },
  { name: "Park Avenue",                  logo: "/logos/park-avenue.jpg" },
  { name: "Madmix",                       logo: "/logos/fmcg/1.png" },
  { name: "Urban Theka",                  logo: "/logos/hospitality/2.png" },
  // Line 2 starts here:
  { name: "Pro Brew Republic",            logo: "/logos/hospitality/3.png" },
  { name: "Round Table India",            logo: "/logos/management/1.png" },
  { name: "Indore Management Association",logo: "/logos/management/2.png" },
  { name: "Zawaa",                        logo: "/logos/fmcg/3.png" },
  { name: "CamPure",                      logo: "/logos/home-kitchen/1.png" },
  { name: "FICCI Flo",                    logo: "/logos/management/5.png" },
  { name: "Swastik Habitates",            logo: "/logos/real-estate/2.png" },
  // Mixed-order tail (no category clustering)
  { name: "The Indian Krunch",            logo: "/logos/fmcg/4.png" },
  { name: "Investitute",                  logo: "/logos/education/2.png" },
  { name: "Coloron Yarns",                logo: "/logos/fashion/1.png" },
  { name: "Conscious Food",               logo: "/logos/fmcg/2.png" },
  { name: "NM Group",                     logo: "/logos/real-estate/1.png" },
  { name: "Currygram",                    logo: "/logos/fmcg/5.png" },
  { name: "Whites of London",             logo: "/logos/home-kitchen/2.png" },
  { name: "Park Avenue Beer Shampoo",     logo: "/logos/personal-care/2.png" },
  { name: "Tushar Enterprises",           logo: "/logos/management/3.png" },
  { name: "Bamboosa",                     logo: "/logos/fmcg/6.png" },
  { name: "Eduvest Connect",              logo: "/logos/education/1.png" },
  { name: "Mr. Elite",                    logo: "/logos/fashion/2.png" },
  { name: "Granny's Omlette",             logo: "/logos/hospitality/4.png" },
  { name: "Om Biomedic",                  logo: "/logos/healthcare/1.png" },
  { name: "The Coffee Clique",            logo: "/logos/fmcg/7.png" },
  { name: "Evara Weddings",               logo: "/logos/management/4.png" },
  { name: "Terra Actives",                logo: "/logos/personal-care/1.png" },
  { name: "Exprto",                       logo: "/logos/education/3.png" },
  { name: "HFL",                          logo: "/logos/real-estate/3.png" },
  { name: "Evora Greens",                 logo: "/logos/fmcg/8.png" },
  { name: "Shreeji Cotfab",               logo: "/logos/fashion/3.png" },
  { name: "Regain",                       logo: "/logos/healthcare/3.png" },
  { name: "Brew Saga",                    logo: "/logos/fmcg/9.png" },
];

// Honeycomb row pattern: strictly alternating, centred by flexbox.
// Desktop fits 5/4 across 8 rows = 36 slots. Mobile narrows to 4/3 across
// 10 rows = 35 slots so the larger mobile orbs don't get clipped at the
// section edges. The user-facing count says "40+" — that's the brand
// count we've actually worked with, not the orbs visible at once.
const ROW_PATTERN_DESKTOP = [5, 4, 5, 4, 5, 4, 5, 4];
const ROW_PATTERN_MOBILE = [4, 3, 4, 3, 4, 3, 4, 3, 4, 3];

// Per-orb tint cycles through the brand palette so the honeycomb picks up
// the same colour language as the rest of the site.
const ORB_COLORS = [
  "var(--c-blue)",
  "var(--c-yellow)",
  "var(--c-pink)",
  "var(--c-mint)",
  "var(--c-red)",
];

function buildRows(brands, pattern) {
  const rows = [];
  let cursor = 0;
  for (const count of pattern) {
    if (cursor >= brands.length) break;
    rows.push(brands.slice(cursor, cursor + count));
    cursor += count;
  }
  return rows;
}

export default function Clients() {
  const rootRef = useRef(null);

  // Mobile uses a narrower 4/3 row pattern so the larger mobile orbs
  // don't overflow the viewport. Track viewport width via matchMedia so
  // a rotation/resize re-renders into the right pattern.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 900px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const rows = buildRows(
    BRANDS,
    isMobile ? ROW_PATTERN_MOBILE : ROW_PATTERN_DESKTOP
  );

  // Apple-Watch fish-eye.
  // Desktop: sticky "stage" + honeycomb translate via rAF.
  // Mobile:  no sticky stage / no internal scroll — the honeycomb
  //          flows in normal page scroll, but the rAF still drives
  //          per-orb scale so each orb grows as it passes through
  //          the viewport centre (the watchOS lift effect, just
  //          synced to natural page scroll instead of an internal
  //          runway).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stage = root.querySelector(".brands-stage");
    const honey = root.querySelector(".brands-honeycomb");
    const orbs = Array.from(root.querySelectorAll(".brand-orb"));
    if (orbs.length === 0 || !honey || !stage) return;

    let raf = 0;
    let inView = false;

    /* No lerp on mobile — every frame writes the exact target. The
       previous lerp made the honeycomb keep drifting for ~½ second
       after the user's finger lifted, which read as "scrolling on
       its own". Setting SMOOTH = 1 binds motion 1:1 to scroll
       position; the longer runway in CSS keeps per-pixel motion
       small enough that it doesn't feel jumpy. */
    const SMOOTH = 1;
    let smoothOffset = null;
    const orbScale = new WeakMap();
    const orbOp = new WeakMap();

    const update = () => {
      const vh = window.innerHeight;
      const stageRect = stage.getBoundingClientRect();
      const stageH = stageRect.height || vh;
      const centre = stageRect.top + stageH / 2;
      const range  = stageH * 0.55;
      const cullTop    = stageRect.top - 200;
      const cullBottom = stageRect.bottom + 200;
      const rootRect = root.getBoundingClientRect();

      // Progress through the sticky runway: 0 when the section's top
      // first hits the viewport top, 1 when its bottom has reached the
      // bottom of the sticky stage.
      const runway = Math.max(1, rootRect.height - stageH);
      const scrolled = -rootRect.top;
      const p = Math.max(0, Math.min(1, scrolled / runway));

      const honeyH = honey.scrollHeight;
      // Mobile pushes endY to 0.95 so honey's bottom reaches near the
      // stage bottom at p=1 (last row visible just inside the bottom
      // mask). Desktop stays at 0.7.
      const startY = stageH * 0.3;
      const endY = -honeyH + stageH * (isMobile ? 0.95 : 0.7);
      const targetOffset = startY + p * (endY - startY);
      if (smoothOffset === null) smoothOffset = targetOffset;
      smoothOffset += (targetOffset - smoothOffset) * SMOOTH;
      honey.style.transform = `translate3d(0, ${smoothOffset.toFixed(1)}px, 0)`;

      // Mobile narrows the fish-eye scale curve so per-frame visual
      // change is less dramatic — feels less "snappy" during scroll.
      const minScale = isMobile ? 0.65 : 0.55;
      const maxScale = isMobile ? 1.05 : 1.1;
      const minOp    = isMobile ? 0.5  : 0.35;
      const maxOp    = 1.0;

      for (const orb of orbs) {
        const rect = orb.getBoundingClientRect();
        if (rect.bottom < cullTop || rect.top > cullBottom) {
          orb.style.setProperty("--orb-scale", String(minScale));
          orb.style.setProperty("--orb-op", String(minOp));
          orbScale.delete(orb);
          orbOp.delete(orb);
          continue;
        }
        const iconCentre = rect.top + rect.height / 2;
        const dist = Math.abs(iconCentre - centre);
        const t = Math.max(0, 1 - dist / range);
        const eased = t * t * (3 - 2 * t);
        const targetScale = minScale + (maxScale - minScale) * eased;
        const targetOp    = minOp    + (maxOp    - minOp)    * eased;

        let s = orbScale.get(orb);
        let o = orbOp.get(orb);
        if (s === undefined) s = targetScale;
        if (o === undefined) o = targetOp;
        s += (targetScale - s) * SMOOTH;
        o += (targetOp    - o) * SMOOTH;
        orbScale.set(orb, s);
        orbOp.set(orb, o);

        orb.style.setProperty("--orb-scale", s.toFixed(3));
        orb.style.setProperty("--orb-op", o.toFixed(3));
      }

      if (inView) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const wasInView = inView;
        inView = entries[0].isIntersecting;
        if (inView && !wasInView) {
          raf = requestAnimationFrame(update);
        } else if (!inView && wasInView) {
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(root);

    update();

    return () => {
      inView = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [isMobile]);

  return (
    <section className="brands" ref={rootRef}>
      <div className="brands-stage">
        <div className="brands-head">
          <p>[Brands we've worked with, 40+]</p>
          <p>Circle ↻ 2018–2026</p>
        </div>

        <div className="brands-edge brands-edge-top" aria-hidden="true" />
        <div className="brands-edge brands-edge-bottom" aria-hidden="true" />

        <div className="brands-honeycomb" aria-label="Brands we've worked with">
          {rows.map((row, ri) => {
            let cursor = 0;
            for (let i = 0; i < ri; i++) cursor += rows[i].length;
            return (
              <div
                className={`brands-honeycomb-row ${ri % 2 === 1 ? "is-offset" : ""}`}
                key={ri}
              >
                {row.map((b, ci) => {
                  const flatIdx = cursor + ci;
                  const color = ORB_COLORS[flatIdx % ORB_COLORS.length];
                  return (
                    <div
                      className="brand-orb"
                      key={b.name}
                      title={b.name}
                      style={{ "--orb-color": color }}
                    >
                      <div className="brand-orb-inner">
                        <img
                          src={b.logo}
                          alt={b.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
