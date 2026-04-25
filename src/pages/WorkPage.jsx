import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurInText from "../components/fx/BlurInText.jsx";
import HandwriteText from "../components/fx/HandwriteText.jsx";
import Footer from "../components/sections/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

const WORK_ITEMS = [
  {
    id: "01",
    slug: "instagram-feed",
    title: "Instagram Feed",
    tags: ["BRAND", "GRID"],
    image: "/portfolio/feed/1.avif",
    size: "lg",
    align: "left",
  },
  {
    id: "02",
    slug: "instagram-posts",
    title: "Instagram Posts",
    tags: ["CAMPAIGN", "CONTENT"],
    image: "/portfolio/posts/1.avif",
    size: "md",
    align: "right",
  },
  {
    id: "03",
    slug: "instagram-stories",
    title: "Instagram Stories",
    tags: ["EXPERIENTIAL", "FILM"],
    image: "/portfolio/stories/1.avif",
    size: "sm",
    align: "left",
  },
  {
    id: "04",
    slug: "marketing-analytics",
    title: "Marketing Analytics",
    tags: ["PERFORMANCE", "META ADS"],
    image: "/portfolio/analytics/1.avif",
    size: "lg",
    align: "right",
  },
];

export default function WorkPage() {
  const cardsWrapRef = useRef(null);

  useEffect(() => {
    const wrap = cardsWrapRef.current;
    if (!wrap) return;
    const cards = Array.from(wrap.querySelectorAll(".work-card"));
    const shapes = Array.from(wrap.querySelectorAll(".work-shape"));

    cards.forEach((c) => {
      gsap.set(c, { autoAlpha: 0, y: 60 });
      ScrollTrigger.create({
        trigger: c,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(c, {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
          }),
      });
    });

    const shapeTrigs = shapes.map((s) => {
      const drift = Number(s.dataset.drift || 60);
      return ScrollTrigger.create({
        trigger: s,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(s, { y: (0.5 - self.progress) * drift });
        },
      });
    });

    return () => {
      shapeTrigs.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => {
        if (cards.includes(t.trigger)) t.kill();
      });
    };
  }, []);

  return (
    <>
      <div className="work-page">
        <section className="work-hero">
        <div className="work-hero-grid">
          <div className="work-hero-left">
            <p className="work-hero-crumb">[03] Selected Work · 2019—2025</p>
            <h1 className="work-hero-title">
              <span className="line">We let the</span>
              <span className="line">
                <em className="work-hero-script">Work</em>
              </span>
              <span className="line">speak,</span>
              <span className="line">loudly.</span>
            </h1>
          </div>

          <div className="work-hero-right">
            <nav className="work-hero-nav">
              <a className="is-active" href="/work">Work,</a>
              <a href="/services">Services,</a>
              <a href="/about">About,</a>
              <a href="/contact">Create with us</a>
            </nav>

            <BlurInText
              as="p"
              split="words"
              stagger={0.02}
              blur={10}
              className="work-hero-copy"
            >
              Every campaign, experience and story we ship starts with strategy
              and ends with impact. Our work moves real people and real
              numbers — because we design for both.
            </BlurInText>

            <p className="work-hero-copy">
              Every project on this page was built on trust, collaboration,
              and a shared obsession with getting it right.
            </p>

            <p className="work-hero-scroll">[Scroll for the receipts ↓]</p>
          </div>
        </div>

        <div className="work-hero-shape work-hero-shape-1" aria-hidden="true" />
        <div className="work-hero-shape work-hero-shape-2" aria-hidden="true" />
        <HandwriteText className="page-signature">Work</HandwriteText>
      </section>

      <section className="work-cards" ref={cardsWrapRef}>
        <div className="work-shape work-shape-sq work-shape-a" data-drift="80" aria-hidden="true" />
        <div className="work-shape work-shape-circle work-shape-b" data-drift="120" aria-hidden="true" />
        <div className="work-shape work-shape-ring work-shape-c" data-drift="60" aria-hidden="true" />
        <div className="work-shape work-shape-sq-outline work-shape-d" data-drift="140" aria-hidden="true" />
        <div className="work-shape work-shape-circle work-shape-e" data-drift="90" aria-hidden="true" />
        <div className="work-shape work-shape-sq work-shape-f" data-drift="100" aria-hidden="true" />
        <div className="work-shape work-shape-ring work-shape-g" data-drift="70" aria-hidden="true" />

        {WORK_ITEMS.map((item, i) => (
          <Link
            to={`/work/${item.slug}`}
            key={item.id}
            className={`work-card work-card-${item.size} work-card-${item.align}`}
            style={{ "--row": i }}
          >
            <div className="work-card-img">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <div className="work-card-label">
              <div>
                <h3>{item.title}</h3>
                <p>{item.tags.join(" · ")}</p>
              </div>
              <span className="work-card-arrow" aria-hidden="true">↗</span>
            </div>
          </Link>
        ))}
      </section>
      </div>
      <Footer />
    </>
  );
}
