import { services } from "../data/content.js";
import BlurInText from "../components/fx/BlurInText.jsx";
import Dissolve from "../components/fx/Dissolve.jsx";
import FlyingImages from "../components/fx/FlyingImages.jsx";
import HandwriteText from "../components/fx/HandwriteText.jsx";
import Footer from "../components/sections/Footer.jsx";

export default function ServicesPage() {
  return (
    <>
      <div className="services-page">
        <section className="services-hero">
        <div className="services-hero-grid">
          <div className="services-hero-left">
            <p className="services-hero-crumb">[02] Services · Disciplines · Deliverables</p>
            <h1 className="services-hero-title">
              <span className="line">Every</span>
              <span className="line">
                <em className="services-hero-script">lever</em>
              </span>
              <span className="line">under one</span>
              <span className="line">roof.</span>
            </h1>
          </div>

          <div className="services-hero-right">
            <nav className="services-hero-nav">
              <a href="/work">Work,</a>
              <a className="is-active" href="/services">Services,</a>
              <a href="/about">Studio,</a>
              <a href="/contact">Create with us</a>
            </nav>

            <BlurInText
              as="p"
              split="words"
              stagger={0.02}
              blur={10}
              className="services-hero-copy"
            >
              Six disciplines, one team, one operating system. We plug into
              your stack or run standalone — either way, the output is
              measured, accountable and compounding.
            </BlurInText>

            <p className="services-hero-copy">
              No retainers built for hours. Every engagement reports against
              a number we set together on day one.
            </p>

            <p className="services-hero-scroll">[Scroll for the disciplines ↓]</p>
          </div>
        </div>

        <div className="services-hero-shape services-hero-shape-1" aria-hidden="true" />
        <div className="services-hero-shape services-hero-shape-2" aria-hidden="true" />
        <HandwriteText className="page-signature">Service</HandwriteText>
      </section>

      <section className="services-body">
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

      <section className="services-flight">
        <FlyingImages
          layout="grid"
          images={[
            "/assets/services/service-left.jpeg",
            "/assets/services/service-1.jpeg",
            "/assets/services/service-right.jpeg",
            "/assets/services/s1.jpg",
            "/assets/services/s2.jpg",
            "/assets/services/s3.jpg",
          ]}
        />
      </section>
      </div>
      <Footer />
    </>
  );
}
