import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "../../data/content.js";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vals = Array.from(el.querySelectorAll(".stat .value"));
    vals.forEach((v) => {
      const target = parseInt(v.dataset.value, 10);
      const suffix = v.dataset.suffix || "";
      if (!Number.isFinite(target)) return;
      gsap.fromTo(
        v,
        { textContent: 0 },
        {
          textContent: target,
          duration: 1.8,
          ease: "power3.out",
          snap: { textContent: 1 },
          scrollTrigger: { trigger: v, start: "top 80%", once: true },
          onUpdate: function () {
            v.textContent = Math.floor(this.targets()[0].textContent) + suffix;
          },
        }
      );
    });
  }, []);

  return (
    <section className="stats" ref={ref}>
      <div className="stats-inner">
        {stats.map((s, i) => {
          const match = s.value.match(/^(\d+)(.*)$/);
          const num = match ? match[1] : "0";
          const suf = match ? match[2] : "";
          return (
            <div className="stat" key={i}>
              <div className="value" data-value={num} data-suffix={suf}>
                0{suf}
              </div>
              <div className="label">{s.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
