import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { k: "IG", label: "Instagram", href: "#" },
  { k: "IN", label: "LinkedIn",  href: "#" },
  { k: "BE", label: "Behance",   href: "#" },
  { k: "VM", label: "Vimeo",     href: "#" },
];

export default function Footer() {
  const ref = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = el.querySelector(".f-cta h2");
    const split = new SplitType(target, {
      types: "chars",
      charClass: "char",
    });

    gsap.set(split.chars, {
      yPercent: 110,
      willChange: "transform",
      display: "inline-block",
    });

    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(split.chars, {
          yPercent: 0,
          duration: 0.9,
          stagger: { amount: 0.35 },
          ease: "power3.out",
        });
      },
    });

    return () => {
      split.revert();
      trig.kill();
    };
  }, []);

  const marqueeWord = "Circle";

  return (
    <section className="footer" ref={ref}>
      <div className="footer-grid">
        <div className="f-cta">
          <p className="f-eyebrow">[Start something]</p>
          <h2>Let's collaborate.</h2>
          <a className="f-email" href="mailto:hello@marketingbycircle.com">
            <span className="f-email-label">hello@marketingbycircle.com</span>
            <span className="f-email-arrow">↗</span>
          </a>
        </div>

        <div className="f-meta">
          <div className="f-meta-block">
            <p className="f-meta-k">Studio</p>
            <p className="f-meta-v">Bangalore · IN</p>
          </div>
          <div className="f-meta-block">
            <p className="f-meta-k">Local</p>
            <p className="f-meta-v">
              <span className="dot" /> {time} IST
            </p>
          </div>
          <div className="f-meta-block">
            <p className="f-meta-k">Status</p>
            <p className="f-meta-v">Taking 2 projects · Q3</p>
          </div>
          <div className="f-meta-block f-socials">
            <p className="f-meta-k">Follow</p>
            <div className="f-social-row">
              {socials.map((s) => (
                <a
                  key={s.k}
                  href={s.href}
                  className="f-social"
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.k}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="f-outro">
        <div className="f-outro-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span className="f-outro-item" key={i}>
              {marqueeWord}
              <span className="f-outro-dot">◯</span>
            </span>
          ))}
        </div>
      </div>

      <div className="f-bottom">
        <p>© 2026 Circle Studio</p>
        <p>Marketing by Circle · v2.0</p>
        <p>Crafted ◯ in Bangalore</p>
      </div>
    </section>
  );
}
