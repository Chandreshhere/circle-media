import { clients } from "../../data/content.js";

export default function Clients() {
  const row = [...clients, ...clients];
  return (
    <section className="clients">
      <div className="clients-head">
        <p>[Selected clients — 25+]</p>
        <p>Circle ↻ 2018–2026</p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {row.map((c, i) => (
            <span className="marquee-item" key={i} title={c.name}>
              <img src={c.logo} alt={c.name} loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
