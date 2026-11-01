import { CAST } from "./data";
import { KindChip } from "./KindChip";
import { PixelSprite } from "./PixelSprite";
import { PxIcon } from "./PxIcon";

const STEPS = [
  { who: "you", name: "You", title: "Fill your fridge", text: "Tap what you have at home." },
  { who: "chef", name: "Chef", title: "Plan the week", text: "Seven dinners that use your fridge first." },
  { who: "shopper", name: "Shopper", title: "Build the list", text: "Everything the plan needs that you don’t have." },
  { who: "you", name: "You", title: "Approve", text: "Check it all in one place, then say yes." },
] as const;

// a tiny pixel tomato that walks the route
const TOMATO = ["......gg......", ".....gggg.....", "...kkkkkkkk...", "..krrrrrrrrk..", ".krrwrrrrrrrk.", ".krwrrrrrrrrk.",
  ".krrrrrrrrrrk.", ".krrrrrrrrrrk.", "..krrrrrrrrk..", "...kkkkkkkk..."];

export function HowItWorks() {
  return (
    <section className="how wrap" id="how-it-works" aria-labelledby="how-title">
      <h2 id="how-title">How it works</h2>
      <p>AI suggests <span aria-hidden="true">→</span> AI lists <span aria-hidden="true">→</span> You approve</p>
      <div className="how-grid">
        <div className="glass route-wrap">
          <ol className="route">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="num">{i + 1}</span>
                <b><span className={`glyph ${s.who}`} aria-hidden="true" />{s.title} <KindChip kind={s.who === "you" ? "you" : "ai"} /></b>
                <span>{s.name}: {s.text}</span>
              </li>
            ))}
          </ol>
          <div className="runner" aria-hidden="true">
            <i>
                <svg viewBox="0 0 14 14" shapeRendering="crispEdges">
                  {TOMATO.flatMap((row, y) => [...row].map((c, x) => c === "." ? null :
                    <rect key={`${x}-${y}`} x={x} y={y + 2} width={1.02} height={1.02} fill={{ g: "#3f9e57", k: "#16171a", r: "#e0533c", w: "#fff" }[c]} />))}
                </svg>
            </i>
          </div>
        </div>
        <div className="glass diagram">
          <h3>Who sees what</h3>
          <ol className="flow">
            <li><div className="node"><span className="ico" aria-hidden="true"><PxIcon name="fridge" /></span>Your fridge<KindChip kind="you" /></div></li>
            <li className="arrow" aria-hidden="true">→</li>
            <li><div className="node"><PixelSprite {...CAST.chef} size={40} />Chef<KindChip kind="ai" /></div></li>
            <li className="arrow" aria-hidden="true">→</li>
            <li><div className="node"><span className="ico" aria-hidden="true"><PxIcon name="plan" /></span>Week plan</div></li>
            <li className="arrow down" aria-hidden="true">→</li>
            <li><div className="node"><PixelSprite {...CAST.shopper} size={40} />Shopper<KindChip kind="ai" /></div></li>
            <li className="arrow back" aria-hidden="true">→</li>
            <li><div className="node"><span className="ico" aria-hidden="true"><PxIcon name="receipt" /></span>Grocery list</div></li>
            <li className="arrow back" aria-hidden="true">→</li>
            <li><div className="node"><PixelSprite {...CAST.you} size={40} />Your approval<KindChip kind="you" /></div></li>
          </ol>
          <p className="flow-note">The Shopper reads both the plan and your fridge, so it never lists what you already have.</p>
        </div>
      </div>
    </section>
  );
}
