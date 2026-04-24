import { testimonials } from "../../data/content.js";
import BlurInText from "../fx/BlurInText.jsx";

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-head">
        <p className="label">[Voices / Clients]</p>
        <h3>Selected words from partners we have grown alongside over the years.</h3>
      </div>
      <div className="testimonials-track">
        {testimonials.map((t, i) => (
          <div className="testimonial" key={i}>
            <div className="meta">
              <p className="author">{t.author}</p>
              <p className="role">{t.role}</p>
            </div>
            <BlurInText as="blockquote" split="words" stagger={0.05} blur={14}>
              <span className="q">“</span>
              {t.quote}
              <span className="q">”</span>
            </BlurInText>
          </div>
        ))}
      </div>
    </section>
  );
}
