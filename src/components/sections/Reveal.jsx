import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Reveal() {
  const holderRef = useRef(null);
  const imgRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const holder = holderRef.current;
    const img = imgRef.current;
    const about = aboutRef.current;
    if (!holder || !img || !about) return;

    const descend = ScrollTrigger.create({
      trigger: holder,
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(img, {
          y: `${-110 + 110 * p}%`,
          rotation: -15 + 15 * p,
        });
      },
    });

    gsap.set(about, { x: () => window.innerWidth, opacity: 0 });

    const panelShift = () =>
      -(about.scrollWidth - window.innerWidth);

    const pinTl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: holder,
        start: "top top",
        end: "+=700%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      },
    });

    pinTl
      .to({}, { duration: 0.3 })
      .to(img, { xPercent: -160, rotation: -540, duration: 0.7 }, 0.3)
      .to(
        about,
        { x: 0, opacity: 1, duration: 0.7 },
        0.3
      )
      .to(about, { x: panelShift, duration: 3.2 }, 1.0);

    return () => {
      descend.kill();
      pinTl.scrollTrigger?.kill();
      pinTl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === holder) t.kill();
      });
    };
  }, []);

  return (
    <>
      <section className="reveal-hero">
        <div className="reveal-header-wrapper">
          <div className="reveal-header reveal-header-1">
            <h1>Circle</h1>
          </div>
          <div className="reveal-header reveal-header-2">
            <h1>Media</h1>
          </div>
        </div>
        <div className="reveal-hero-footer">
          <div className="reveal-hero-footer-tags">
            <p className="mn">Made in India</p>
          </div>
        </div>
      </section>

      <section className="reveal-img-holder" ref={holderRef}>
        <div className="reveal-img" ref={imgRef}>
          <img src="/logoonly.png" alt="" />
        </div>

        <div className="reveal-about-clip">
          <div className="reveal-about" ref={aboutRef}>
            <article className="about-panel about-panel-intro">
              <div className="about-panel-head">
                <span className="about-stamp">00:15</span>
                <span className="about-stamp">About Us</span>
                <span className="about-stamp">00:20</span>
              </div>

              <h2 className="about-title" data-float data-drift="50" data-spin="1.5">
                Circle is a digital<br />
                marketing agency.
              </h2>

              <p className="about-body" data-float data-drift="90" data-spin="-1.5">
                Specializing in social-media-first campaigns. Over 6 years of
                experience and 25+ clients served, helping businesses build and
                grow their online presence through content, influencer
                marketing, and digital advertising.
              </p>

              <div className="about-stat about-stat-years" data-float data-drift="70" data-spin="3">
                <span className="about-stat-k">Years</span>
                <span className="about-stat-v">06+</span>
              </div>

              <div className="about-stat about-stat-clients" data-float data-drift="100" data-spin="-2.5">
                <span className="about-stat-k">Clients</span>
                <span className="about-stat-v">25+</span>
              </div>

              <div className="about-stat about-stat-focus" data-float data-drift="60" data-spin="2">
                <span className="about-stat-k">Focus</span>
                <span className="about-stat-v">Social</span>
              </div>
            </article>

            <article className="about-panel about-panel-process">
              <div className="about-panel-head">
                <span className="about-stamp">Process</span>
                <span className="about-stamp">04 Steps</span>
              </div>

              <span className="process-ghost process-ghost-a" data-float data-drift="60" data-spin="1.5">Process</span>

              <figure
                className="process-float process-float-1"
                data-float
                data-drift="70"
                data-spin="2"
              >
                <span className="process-float-num">01</span>
                <div className="process-float-img">
                  <img src="/assets/process/research.png" alt="" onError={(e)=>{e.currentTarget.src='/assets/process-float.png';}} />
                </div>
                <figcaption>
                  <h3>Research and Planning</h3>
                  <p>Audit, audience study, and a roadmap grounded in data.</p>
                </figcaption>
              </figure>

              <figure
                className="process-float process-float-2"
                data-float
                data-drift="110"
                data-spin="-3"
              >
                <span className="process-float-num">02</span>
                <div className="process-float-img">
                  <img src="/assets/process/implement.png" alt="" onError={(e)=>{e.currentTarget.src='/assets/process-float.png';}} />
                </div>
                <figcaption>
                  <h3>Implement Digital Solutions</h3>
                  <p>Content, creative, and campaigns shipped to schedule.</p>
                </figcaption>
              </figure>

              <figure
                className="process-float process-float-3"
                data-float
                data-drift="50"
                data-spin="-2"
              >
                <span className="process-float-num">03</span>
                <div className="process-float-img">
                  <img src="/assets/process/analyze.png" alt="" onError={(e)=>{e.currentTarget.src='/assets/process-float.png';}} />
                </div>
                <figcaption>
                  <h3>Analysis and Optimization</h3>
                  <p>Track, learn, and tune every channel for compounding results.</p>
                </figcaption>
              </figure>

              <figure
                className="process-float process-float-4"
                data-float
                data-drift="130"
                data-spin="3"
              >
                <span className="process-float-num">04</span>
                <div className="process-float-img">
                  <img src="/assets/process/adapt.png" alt="" onError={(e)=>{e.currentTarget.src='/assets/process-float.png';}} />
                </div>
                <figcaption>
                  <h3>Adapt and Evolve</h3>
                  <p>Stay ahead of platform shifts, trends, and audience behaviour.</p>
                </figcaption>
              </figure>
            </article>

            <article className="about-panel about-panel-quote">
              <span className="about-quote-mark">&ldquo;</span>
              <h2 className="about-quote-text">
                Circle the World
                <br />
                with Us.
              </h2>
              <p className="about-quote-sub">
                Building brands that compound, season after season.
              </p>
            </article>

          </div>
        </div>
      </section>
    </>
  );
}
