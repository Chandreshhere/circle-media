import { carouselItems } from "../data/content.js";
import BlurInText from "../components/fx/BlurInText.jsx";
import FlyingImages from "../components/fx/FlyingImages.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function WorkPage() {
  const flyers = carouselItems.flatMap((i) => [i.main, i.bg]);
  return (
    <div className="subpage">
      <section className="subpage-hero">
        <p className="crumb">[03] Work · Selected case studies</p>
        <BlurInText as="h1" split="chars" stagger={0.02} blur={22}>
          Proof, not promises.
        </BlurInText>
        <p className="sub">
          A curated selection of campaigns, launches, identities and always-on
          programmes — each a different shape of the same thesis: measure,
          iterate, compound.
        </p>
      </section>

      <div className="work-grid">
        {carouselItems.map((item) => (
          <div className="work-tile" key={item.id}>
            <img src={item.main} alt={item.title} />
            <div className="overlay">
              <div>
                <h3>{item.title}</h3>
                <span className="tag">{item.tags[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section style={{ padding: "4rem 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.25rem 2rem" }}>
          <p style={{ color: "var(--text-dim)" }}>[Archive flight]</p>
        </div>
        <FlyingImages images={flyers} />
      </section>

      <Footer />
    </div>
  );
}
