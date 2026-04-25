import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "../../data/content.js";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const [history, setHistory] = useState([0]);
  const activeRef = useRef(0);
  const STACK_DEPTH = 6;

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const list = listRef.current;
    if (!root || !stage || !list) return;

    const items = Array.from(list.querySelectorAll(".services-list-item"));
    if (!items.length) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 820px)", () => {
      const itemH = items[0].getBoundingClientRect().height;
      const total = items.length;
      const travel = (total - 1) * itemH;

      gsap.set(list, { y: 0 });

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * total}`,
        pin: stage,
        pinType: "transform",
        pinSpacing: true,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const y = -p * travel;
          gsap.set(list, { y });

          const idx = Math.min(total - 1, Math.floor(p * total));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
            setHistory((h) =>
              [idx, ...h.filter((x) => x !== idx)].slice(0, STACK_DEPTH)
            );
          }
        },
        onRefresh: () => {
          gsap.set(list, { y: 0 });
          activeRef.current = 0;
          setActive(0);
          setHistory([0]);
        },
      });

      return () => {
        st.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section className="services-scroll" ref={rootRef}>
      <div className="services-stage" ref={stageRef}>
        <div className="services-label">
          <p>[Services]</p>
          <p>The disciplines we master</p>
        </div>

        <div className="services-grid">
          <div className="services-list-viewport">
            <ul className="services-list" ref={listRef}>
              {services.map((s, i) => (
                <li
                  key={s.id}
                  className={`services-list-item ${
                    i === active ? "is-active" : ""
                  }`}
                >
                  {s.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="services-media">
            <div className="services-media-stack">
              {services.map((s, i) => {
                const level = history.indexOf(i);
                const state = level >= 0 ? `is-stack-${level}` : "";
                return (
                  <div
                    key={s.id}
                    className={`services-media-frame ${state}`}
                    aria-hidden={i !== active}
                  >
                    <img src={s.image} alt={s.title} loading="lazy" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="services-tagline">
            {services.map((s, i) => {
              const level = history.indexOf(i);
              const state =
                i === active
                  ? "is-active"
                  : level === 1
                  ? "is-prev"
                  : "";
              return (
                <p
                  key={s.id}
                  className={`services-tagline-line ${state}`}
                  aria-hidden={i !== active}
                >
                  {s.tagline}
                </p>
              );
            })}
          </div>
        </div>

        <div className="services-counter">
          <span className="current">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="divider">/</span>
          <span className="total">
            {String(services.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
