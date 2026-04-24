import BlurInText from "../components/fx/BlurInText.jsx";
import Dissolve from "../components/fx/Dissolve.jsx";
import ShaderBackground from "../components/fx/ShaderBackground.jsx";
import Stats from "../components/sections/Stats.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function AboutPage() {
  return (
    <div className="subpage">
      <section className="subpage-hero">
        <ShaderBackground
          colorA={[0.015, 0.015, 0.02]}
          colorB={[0.22, 0.12, 0.3]}
          intensity={0.6}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="crumb">[04] Studio · Philosophy · People</p>
          <BlurInText as="h1" split="chars" stagger={0.02} blur={22}>
            A studio built for the long game.
          </BlurInText>
          <p className="sub">
            Circle is a full-service marketing studio for ambitious brands.
            Strategy, creative and performance under one roof — run by
            operators, not account managers.
          </p>
        </div>
      </section>

      <section className="subpage-body">
        <Dissolve>
          <div className="two-col">
            <p className="label">[Origin]</p>
            <div>
              <h3>We started Circle because agencies were built for briefs, not outcomes.</h3>
              <p>
                Brands needed a partner that could move from brand platform to
                campaign to retention loop without losing the plot. Circle is
                that partner — a single team, measured against your number, not
                scope documents.
              </p>
            </div>
          </div>
        </Dissolve>

        <Dissolve>
          <div className="two-col">
            <p className="label">[Principles]</p>
            <div>
              <h3>Four things we do not compromise on.</h3>
              <p>
                One: the brief is a hypothesis, not a contract. Two: creative is
                a performance lever. Three: dashboards beat decks. Four: the
                best work outlives the calendar.
              </p>
            </div>
          </div>
        </Dissolve>
      </section>

      <Stats />
      <Testimonials />
      <Footer />
    </div>
  );
}
