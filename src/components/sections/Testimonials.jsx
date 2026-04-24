import { testimonials } from "../../data/content.js";
import BlurInText from "../fx/BlurInText.jsx";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="testimonials">
      <div className="testimonials-head">
        <p className="label">[Voices / Clients]</p>
        <h3>
          Selected words from partners we have grown alongside over the years.
        </h3>
      </div>

      <div className="testimonials-bento">
        <article className="t-card t-card--featured">
          <span className="t-glyph">“</span>
          <span className="t-index">01</span>
          <BlurInText as="blockquote" split="words" stagger={0.04} blur={14}>
            {featured.quote}
          </BlurInText>
          <div className="t-meta">
            <div className="t-avatar">{initialsOf(featured.author)}</div>
            <div>
              <p className="t-author">{featured.author}</p>
              <p className="t-role">{featured.role}</p>
            </div>
          </div>
        </article>

        <div className="t-stack">
          {rest.map((t, i) => (
            <article className="t-card t-card--mini" key={i}>
              <span className="t-index">0{i + 2}</span>
              <blockquote>{t.quote}</blockquote>
              <div className="t-meta">
                <div className="t-avatar t-avatar--sm">
                  {initialsOf(t.author)}
                </div>
                <div>
                  <p className="t-author">{t.author}</p>
                  <p className="t-role">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
