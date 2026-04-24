import { useState } from "react";
import BlurInText from "../components/fx/BlurInText.jsx";
import ShaderBackground from "../components/fx/ShaderBackground.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="subpage">
      <section className="subpage-hero">
        <ShaderBackground
          colorA={[0.015, 0.015, 0.02]}
          colorB={[0.08, 0.24, 0.18]}
          intensity={0.55}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="crumb">[05] Contact · Briefs · Partnerships</p>
          <BlurInText as="h1" split="chars" stagger={0.02} blur={22}>
            Tell us what you are building.
          </BlurInText>
          <p className="sub">
            We reply within one business day. If you would rather skip the
            form, drop us a line at <span style={{ color: "var(--accent)" }}>hello@circle.studio</span>.
          </p>
        </div>
      </section>

      <section className="subpage-body">
        <div className="contact-grid">
          <form className="contact-form" onSubmit={submit}>
            <label>
              <span>Name</span>
              <input type="text" required placeholder="Your name" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" required placeholder="you@company.com" />
            </label>
            <label>
              <span>Company</span>
              <input type="text" placeholder="Optional" />
            </label>
            <label>
              <span>Brief</span>
              <textarea required placeholder="A few lines on what you are building, where you are today and what success looks like." />
            </label>
            <button type="submit">{sent ? "Sent ✓" : "Send brief"}</button>
          </form>

          <aside className="contact-aside">
            <h3>Studios</h3>
            <p>Mumbai · Bengaluru · remote collaboration, globally.</p>
            <h3 style={{ marginTop: "2rem" }}>Hours</h3>
            <p>Monday — Friday, 09:30 to 19:00 IST.</p>
            <h3 style={{ marginTop: "2rem" }}>For press</h3>
            <p>press@circle.studio</p>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
