import { clients } from "../../data/content.js";

export default function Clients() {
  const rows = [[], [], []];
  clients.forEach((c, i) => rows[i % 3].push(c));

  return (
    <section className="clients">
      <div className="clients-head">
        <p>[Selected clients — 25+]</p>
        <p>Circle ↻ 2018–2026</p>
      </div>

      <div className="marquee-stack">
        {rows.map((row, ri) => {
          const loop = [...row, ...row, ...row, ...row];
          return (
            <div className="marquee" key={ri}>
              <div
                className={`marquee-track ${ri % 2 === 1 ? "is-reverse" : ""}`}
              >
                {loop.map((c, i) => (
                  <span className="marquee-item" key={i} title={c.name}>
                    <img src={c.logo} alt={c.name} loading="lazy" />
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
