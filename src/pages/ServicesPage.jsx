import { services } from "../data/content.js";
import BlurInText from "../components/fx/BlurInText.jsx";
import Dissolve from "../components/fx/Dissolve.jsx";
import ShaderBackground from "../components/fx/ShaderBackground.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function ServicesPage() {
  return (
    <div className="subpage">
      <section className="subpage-hero">
        <ShaderBackground
          colorA={[0.02, 0.02, 0.025]}
          colorB={[0.1, 0.06, 0.2]}
          intensity={0.55}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="crumb">[02] Services · Disciplines · Deliverables</p>
          <BlurInText as="h1" split="chars" stagger={0.02} blur={22}>
            Every lever we pull — under one roof.
          </BlurInText>
          <p className="sub">
            Six disciplines, one team, one operating system. We plug into your
            stack or run standalone — either way, the output is measured,
            accountable and compounding.
          </p>
        </div>
      </section>

      <section className="subpage-body">
        {services.map((s) => (
          <Dissolve key={s.id}>
            <div className="two-col">
              <div>
                <p className="label">[{s.id}]</p>
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </div>
            </div>
          </Dissolve>
        ))}
      </section>

      <Footer />
    </div>
  );
}
