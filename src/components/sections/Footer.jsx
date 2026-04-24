import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const split = new SplitType(el.querySelector(".outro h1"), {
      types: "chars",
      charClass: "char",
    });

    gsap.set(".footer .outro .char", {
      y: 500,
      willChange: "transform",
      display: "inline-block",
    });

    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(".footer .outro .char", {
          y: 0,
          duration: 0.9,
          stagger: { amount: 0.4 },
          ease: "power3.out",
        });
      },
    });

    return () => {
      split.revert();
      trig.kill();
    };
  }, []);

  return (
    <section className="footer" ref={ref}>
      <div className="wrapper">
        <div className="footer-row contact">
          <div className="footer-col email">
            <h2>Let's collaborate</h2>
            <h2>↳ hello@circle.studio</h2>
          </div>
          <div className="footer-col socials">
            <div className="social">
              <p className="index">[01]</p>
              <a href="#"><p>Instagram</p></a>
            </div>
            <div className="social">
              <p className="index">[02]</p>
              <a href="#"><p>LinkedIn</p></a>
            </div>
            <div className="social">
              <p className="index">[03]</p>
              <a href="#"><p>Behance</p></a>
            </div>
            <div className="social">
              <p className="index">[04]</p>
              <a href="#"><p>Vimeo</p></a>
            </div>
          </div>
        </div>
        <div className="footer-row outro">
          <h1>Circle ◯</h1>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Circle Studio</p>
          <p>Made with ◯ in the studio</p>
        </div>
      </div>
    </section>
  );
}
