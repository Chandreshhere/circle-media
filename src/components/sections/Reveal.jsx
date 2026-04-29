import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WavyImage from "../fx/WavyImage.jsx";

gsap.registerPlugin(ScrollTrigger);

const QUOTE_CYCLE = [
  "Build brands that compound, season after season.",
  "Create. Launch. Grow. Scale.",
  "Strategy, content, performance — one operating system.",
  "Measured. Accountable. Relentless."
];

export default function Reveal() {
  const holderRef = useRef(null);
  const imgRef = useRef(null);
  const aboutRef = useRef(null);
  const quoteRef = useRef(null);
  const [cycleIdx, setCycleIdx] = useState(0);

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
        const endY = window.innerWidth <= 900 ? 6 : 0;
        gsap.set(img, {
          y: `${-110 + (110 + endY) * p}%`,
          rotation: -15 + 15 * p,
        });
      },
    });

    gsap.set(about, { x: () => window.innerWidth, opacity: 0 });

    const countTrigs = gsap.utils.toArray(".reveal-stat-v").map((el) => {
      const target = Number(el.dataset.target || 0);
      const numEl = el.querySelector(".reveal-stat-num");
      const obj = { val: 0 };
      return gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: holder,
          start: "top 70%",
          once: true,
        },
        onUpdate: () => {
          if (numEl) numEl.textContent = Math.round(obj.val);
        },
      });
    });

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
        pinType: "transform",
        pinSpacing: true,
        anticipatePin: 1,
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
      .to(
        ".reveal-stat",
        {
          xPercent: (i, el) => Number(el.dataset.exitX || 0),
          duration: 0.7,
          ease: "none",
          stagger: 0.04,
        },
        0.3
      )
      .to(about, { x: panelShift, duration: 3.2 }, 1.0);

    // Quote fill setup
    let quoteResize;
    let lines;
    if (quoteRef.current) {
      const stack = quoteRef.current.querySelector(".about-quote-stack");
      lines = quoteRef.current.querySelectorAll(".quote-line");
      lines.forEach((l) => l.style.setProperty("--fill", "0%"));

      const syncStackWidth = () => {
        if (!stack) return;
        let widest = 0;
        lines.forEach((line) => {
          widest = Math.max(widest, line.getBoundingClientRect().width);
        });
        // pad a few pixels so the wave-front fully clears the right edge of the widest letterforms
        stack.style.setProperty("--quote-width", `${Math.ceil(widest) + 12}px`);
      };
      syncStackWidth();
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          syncStackWidth();
          ScrollTrigger.refresh();
        });
      }
      quoteResize = () => {
        syncStackWidth();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", quoteResize);
    }

    // Title splash setup
    const introPanel = about.querySelector(".about-panel-intro");
    const splashTitle = introPanel?.querySelector(".about-title-splash");
    if (splashTitle) splashTitle.style.setProperty("--splash", "0%");

    // Fills are computed from the about element's animated x value plus each
    // panel's static offsetLeft. This avoids getBoundingClientRect entirely,
    // which on iOS Safari can return inconsistent values during nested
    // transform animations (the pin uses transform pinning + about uses its
    // own x tween). Triggered on every gsap.ticker frame so it tracks
    // whatever scroll mechanism is driving the pin.
    // Wider window on mobile = more scroll distance to traverse 0→1 = slower
    // perceived fill. The title gets a wider/slower window than the quote so
    // each animation paces well for its panel size.
    const computeFromLeft = (left, vwLocal, mode) => {
      const isMobile = vwLocal <= 900;
      let start, end, boost;
      if (isMobile && mode === "title") {
        start = vwLocal * 1.20;
        end   = vwLocal * -0.60;
        boost = 1.0;
      } else if (isMobile && mode === "quote") {
        start = vwLocal * 1.05;
        end   = vwLocal * -0.20;
        boost = 1.10;
      } else {
        start = vwLocal * 0.92;
        end   = vwLocal * 0.25;
        boost = 1.15;
      }
      const span = start - end;
      const p = Math.max(0, Math.min(1, (start - left) / span));
      return Math.min(p * boost, 1);
    };

    let lastSplash = -1;
    let lastFill = -1;
    const tickFills = () => {
      const vw = window.innerWidth;
      const aboutX = parseFloat(gsap.getProperty(about, "x")) || 0;
      if (introPanel && splashTitle) {
        const left = aboutX + introPanel.offsetLeft;
        const p = computeFromLeft(left, vw, "title") * 100;
        if (Math.abs(p - lastSplash) > 0.1) {
          lastSplash = p;
          splashTitle.style.setProperty("--splash", `${p}%`);
        }
      }
      if (quoteRef.current && lines && lines.length) {
        const left = aboutX + quoteRef.current.offsetLeft;
        const p = computeFromLeft(left, vw, "quote") * 100;
        if (Math.abs(p - lastFill) > 0.1) {
          lastFill = p;
          const fill = `${p}%`;
          lines.forEach((line) => line.style.setProperty("--fill", fill));
        }
      }
    };
    gsap.ticker.add(tickFills);

    return () => {
      descend.kill();
      pinTl.scrollTrigger?.kill();
      pinTl.kill();
      gsap.ticker.remove(tickFills);
      if (quoteResize) window.removeEventListener("resize", quoteResize);
      countTrigs.forEach((t) => t?.scrollTrigger?.kill());
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === holder) t.kill();
      });
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCycleIdx((i) => (i + 1) % QUOTE_CYCLE.length);
    }, 1400);
    return () => clearInterval(id);
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
        <div className="reveal-stats-bg" aria-hidden="true">
          <span className="reveal-stats-kicker">Growing with You</span>

          <div className="reveal-stat reveal-stat-1" data-exit-x="-700">
            <span className="reveal-stat-v" data-target="25">
              <span className="reveal-stat-num">0</span>
              <sup>+</sup>
            </span>
            <span className="reveal-stat-k">Top Clients Served</span>
          </div>

          <div className="reveal-stat reveal-stat-2" data-exit-x="-900">
            <span className="reveal-stat-v" data-target="5">
              <span className="reveal-stat-num">0</span>
              <sup>+</sup>
            </span>
            <span className="reveal-stat-k">Years of Experience</span>
          </div>

          <div className="reveal-stat reveal-stat-3" data-exit-x="-650">
            <span className="reveal-stat-v" data-target="100">
              <span className="reveal-stat-num">0</span>
              <sup>+</sup>
            </span>
            <span className="reveal-stat-k">Social Media Campaigns</span>
          </div>

          <div className="reveal-stat reveal-stat-4" data-exit-x="-850">
            <span className="reveal-stat-v" data-target="800">
              <span className="reveal-stat-num">0</span>
              <sup>+</sup>
            </span>
            <span className="reveal-stat-k">Performance Ads Created</span>
          </div>
        </div>

        <div className="reveal-img" ref={imgRef}>
          <img src="/logoonly.png" alt="" />
        </div>

        <div className="reveal-about-clip">
          <div className="reveal-about" ref={aboutRef}>
            <article className="about-panel about-panel-intro">
              <h2 className="about-title about-title-splash" data-float data-drift="50" data-spin="1.5">
                Circle is a digital<br />
                marketing agency.
              </h2>

              <p className="about-body" data-float data-drift="90" data-spin="-1.5">
                Specializing in social-media-first campaigns. Over 6 years of
                experience and 25+ clients served, helping businesses build and
                grow their online presence through content, influencer
                marketing, and digital advertising.
              </p>

            </article>

            <article className="about-panel about-panel-process">
              <span className="process-ghost process-ghost-a" data-float data-drift="60" data-spin="1.5">Process</span>

              <figure
                className="process-float process-float-1"
                data-float
                data-drift="70"
                data-spin="2"
              >
                <span className="process-float-num">01</span>
                <div className="process-float-img">
                  <WavyImage src="/assets/process/research.png" alt="Research" />
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
                  <WavyImage src="/assets/process/digital.png" alt="Digital" />
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
                  <WavyImage src="/assets/process/analyze.png" alt="Analyze" />
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
                  <WavyImage src="/assets/process/evolve.png" alt="Evolve" />
                </div>
                <figcaption>
                  <h3>Adapt and Evolve</h3>
                  <p>Stay ahead of platform shifts, trends, and audience behaviour.</p>
                </figcaption>
              </figure>
            </article>

            <article
              className="about-panel about-panel-quote"
              ref={quoteRef}
            >
              <h2 className="about-quote-stack" aria-label="Circle the world with us.">
                <span className="quote-line-wrap"><span className="quote-line">Circle the</span></span>
                <span className="quote-line-wrap"><span className="quote-line">World</span></span>
                <span className="quote-line-wrap"><span className="quote-line">with Us.</span></span>
              </h2>
              <div className="quote-sub-wrap" aria-live="polite">
                <p className="about-quote-sub" key={cycleIdx}>
                  {QUOTE_CYCLE[cycleIdx]}
                </p>
              </div>
            </article>

          </div>
        </div>
      </section>
    </>
  );
}
