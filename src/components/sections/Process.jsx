import { processSteps } from "../../data/content.js";
import BlurInText from "../fx/BlurInText.jsx";
import Dissolve from "../fx/Dissolve.jsx";

export default function Process() {
  return (
    <section className="process">
      <div className="process-head">
        <p className="label">[Method / 01–04]</p>
        <BlurInText as="h2" split="words" stagger={0.08}>
          A measured system that turns ideas into outcomes — then tunes itself.
        </BlurInText>
      </div>
      <Dissolve>
        <div className="process-grid">
          {processSteps.map((s) => (
            <div className="process-step" key={s.id}>
              <p className="num">[{s.id}]</p>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
            </div>
          ))}
        </div>
      </Dissolve>
    </section>
  );
}
