import GlobeWebGL from "../fx/GlobeWebGL.jsx";

/* Global Reach — sits below the Brands marquee. Highlights that Circle works
   with both domestic and international clients across quick-commerce, with a
   real WebGL globe (auto-rotating, drag-interactive) on the right and copy
   on the left. */

const REGIONS = [
  { flag: "🇮🇳", name: "India",          tag: "Domestic" },
  { flag: "🇦🇪", name: "Amazon Dubai",   tag: "Quick commerce" },
  { flag: "🇺🇸", name: "Amazon USA",     tag: "Quick commerce" },
  { flag: "🇸🇦", name: "Saudi Arabia",   tag: "Cross-border" },
];

export default function Reach() {
  return (
    <section className="reach">
      <div className="reach-inner">
        <header className="reach-head">
          <p className="reach-eyebrow">[Global reach]</p>
          <h2 className="reach-title">
            Domestic and international clients —{" "}
            <span className="reach-accent">working in 4+ countries.</span>
          </h2>
          <p className="reach-sub">
            We help brands grow on quick commerce — Amazon Dubai, Amazon USA,
            and domestic Q-commerce — with strategy, listings and performance
            built for each marketplace.
          </p>
        </header>

        <div className="reach-grid">
          <div className="reach-left">
            <ul className="reach-pills">
              {REGIONS.map((r) => (
                <li className="reach-pill" key={r.name}>
                  <span className="reach-pill-flag" aria-hidden="true">
                    {r.flag}
                  </span>
                  <span className="reach-pill-text">
                    <span className="reach-pill-name">{r.name}</span>
                    <span className="reach-pill-tag">{r.tag}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="reach-stat">
              <span className="reach-stat-num">4<sup>+</sup></span>
              <span className="reach-stat-label">
                countries served
                <br />
                across quick&#8209;commerce
              </span>
            </div>
          </div>

          <div className="reach-right">
            <GlobeWebGL />
          </div>
        </div>
      </div>
    </section>
  );
}
