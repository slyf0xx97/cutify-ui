"use client";
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CAST, chefPlan, DAYS, FOODS, recipe, shopperList } from "./data";
import { KindChip } from "./KindChip";
import { PixelSprite } from "./PixelSprite";
import { Popup } from "./Popup";
import { StageHeader } from "./StageHeader";
import { useOffscreenPause } from "./useOffscreenPause";
import { WordTip } from "./WordTip";

type Phase = "idle" | "chef" | "shopper" | "ready";

function Tip({ about, title, lines, tone }: { about: string; title: string; lines: string[]; tone?: string }) {
  return (
    <WordTip word={<span className="i-dot" aria-hidden="true">i</span>} label={`About ${about}`} title={title} tone={tone}>
      <ul>{lines.map((l) => <li key={l}>{l}</li>)}</ul>
    </WordTip>
  );
}

function Explain({ steps }: { steps: ReactNode[] }) {
  return (
    <p className="explain">
      {steps.map((s, i) => <Fragment key={i}>{i > 0 && <i aria-hidden="true">→</i>}<span>{s}</span></Fragment>)}
    </p>
  );
}

const wait = (ms: number) => new Promise<void>((r) =>
  setTimeout(r, matchMedia("(prefers-reduced-motion: reduce)").matches ? Math.min(ms, 120) : ms));

export function Planner() {
  useOffscreenPause(".hero, .stage, #how-it-works");
  const [fridge, setFridge] = useState(() => new Set(FOODS.filter((f) => f.inFridge).map((f) => f.id)));
  const [plan, setPlan] = useState<string[] | null>(null);
  const [bench, setBench] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [approved, setApproved] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [stale, setStale] = useState(false);
  const run = useRef(0);

  const list = useMemo(() => (plan ? shopperList(plan, fridge) : []), [plan, fridge]);
  const used = useMemo(() => new Set(plan?.flatMap((id) => recipe(id).needs.filter((n) => fridge.has(n)))), [plan, fridge]);
  useEffect(() => () => { run.current++; }, []);

  function toggle(id: string) {
    setFridge((f) => { const n = new Set(f); if (!n.delete(id)) n.add(id); return n; });
    setApproved(false);
    if (plan) setStale(true);
  }

  async function askChef() {
    const id = ++run.current;
    setApproved(false); setStale(false); setPhase("chef"); setPlan(null);
    await wait(1400); if (id !== run.current) return;
    const next = chefPlan(fridge);
    setPlan(next.plan); setBench(next.bench); setPhase("shopper");
    await wait(1100); if (id !== run.current) return;
    setPhase("ready");
  }

  function swap(day: number) {
    if (!plan || bench.length === 0) return;
    const next = [...plan]; const out = next[day];
    next[day] = bench[0];
    setPlan(next); setBench([...bench.slice(1), out]); setApproved(false);
  }

  const chefStatus = phase === "chef" ? <span className="pill working">Working<span className="dots" /></span>
    : plan ? <span className="pill done">✓ Done</span> : <span className="pill">Waiting for you</span>;
  const shopperStatus = phase === "shopper" ? <span className="pill working">Working<span className="dots" /></span>
    : phase === "ready" ? <span className="pill done">✓ Done</span> : <span className="pill">Waiting for the Chef</span>;

  return (
    <div className="journey wrap">
      {/* Stage 1 */}
      <section className="stage" id="fridge" aria-labelledby="s1-title">
        <StageHeader n={1} titleId="s1-title" title="Fill your fridge" icon="🧊" line="Tap what you have. The Chef plans around it."
          aside={<><KindChip kind="you" /><Tip about="filling your fridge" title="Why start with the fridge" lines={[
            "Each tile is one thing in your fridge.",
            "Tap to add or remove it.",
            "The Chef ranks recipes by how much they use from here.",
            "Why: cooking what you have means less waste and a shorter list.",
          ]} /></>} />
        <Explain steps={["You tick what’s inside", "The Chef reads the list", "Fewer things to buy"]} />
        <div className="stage-body">
          <div className="fridge-head">
            <span className="mono" aria-live="polite">{fridge.size} of {FOODS.length} items in your fridge</span>
            <span className="tag sample">Sample fridge</span>
          </div>
          <ul className="fridge-grid">
            {FOODS.map((f) => {
              const on = fridge.has(f.id);
              return (
                <li key={f.id}>
                  <button type="button" className="food" aria-pressed={on} onClick={() => toggle(f.id)}>
                    <span className="ico" aria-hidden="true">{f.icon}</span>
                    <span><b>{f.name}</b><small>{on ? "✓ In fridge" : "＋ Not in fridge"}</small></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="feed" aria-hidden="true" />

      {/* Stage 2 */}
      <section className="stage" id="chef" aria-labelledby="s2-title">
        <StageHeader n={2} titleId="s2-title" title="Let the Chef plan your week" icon="🍳" line="Seven dinners, picked to use up your fridge first."
          aside={<><KindChip kind="ai" /><Tip about="the Chef" title="What the Chef does" tone="var(--chef-bar)" lines={[
            "Reads what’s in your fridge.",
            "Picks seven dinners that use the most of it.",
            "Shows how much of each dinner you already have.",
            "Swap any day you don’t fancy.",
            "Why an AI helper: it can weigh what you have against many recipes at once.",
          ]} /></>} />
        <Explain steps={[<><span className="glyph chef" />Chef reads your fridge</>, "Ranks recipes", "Fills Mon to Sun"]} />
        <div className="stage-body agent-row">
          <div className="card agent chef">
            <div className={"sprite-box" + (phase === "chef" ? " talking" : plan ? "" : " quiet")}>
              <PixelSprite {...CAST.chef} size={88} label="Chef, the recipe helper" className={phase === "chef" ? "" : "bob"} />
            </div>
            <h3><span className="glyph chef" aria-hidden="true" />Chef <KindChip kind="ai" /></h3>
            {chefStatus}
            <p>Suggests recipes from what’s in your fridge.</p>
            <button type="button" className="btn primary" onClick={askChef} disabled={phase === "chef" || phase === "shopper"}>
              {plan ? "↻ Ask again" : "▶ Ask the Chef"}
            </button>
          </div>
          <div>
            {stale && phase === "ready" && <p className="note-gap" role="status">↺ Your fridge changed. Ask the Chef again for a fresh plan.</p>}
            {plan ? (
              <ol className="week" aria-label="Your week">
                {plan.map((id, i) => {
                  const r = recipe(id), have = r.needs.filter((n) => fridge.has(n)).length;
                  return (
                    <li className="day fade-up" key={DAYS[i]} style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="day-top"><span className="day-name">{DAYS[i]}</span><span className="day-ico" aria-hidden="true">{r.icon}</span></div>
                      <h4>{r.name}</h4>
                      <div className="uses">
                        <span className="mono">{have} of {r.needs.length}</span> from your fridge
                        <span className="meter" aria-hidden="true"><i style={{ width: `${(have / r.needs.length) * 100}%` }} /></span>
                      </div>
                      <button type="button" className="btn small" onClick={() => swap(i)} disabled={phase !== "ready"}
                        aria-label={`Swap ${DAYS[i]}: ${r.name}`}>↻ Swap</button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="empty" role="status">{phase === "chef" ? "The Chef is reading your fridge…" : "The Chef’s plan shows up here."}</div>
            )}
            <p className="prov">ⓘ Sample run. Here the Chef picks from 10 made-up recipes, not a live AI model.</p>
          </div>
        </div>
      </section>

      <div className="feed" aria-hidden="true" />

      {/* Stage 3 */}
      <section className="stage" id="shopper" aria-labelledby="s3-title">
        <StageHeader n={3} titleId="s3-title" title="Let the Shopper build your list" icon="🧺" line="Only what the plan needs and your fridge doesn’t have."
          aside={<><KindChip kind="ai" /><Tip about="the Shopper" title="What the Shopper does" tone="var(--shopper-bar)" lines={[
            "Reads the Chef’s plan and your fridge.",
            "Lists every missing ingredient once.",
            "Says how many dinners need each one.",
            "Updates the list when you swap a day.",
            "Why: one list means one trip to the shop.",
          ]} /></>} />
        <Explain steps={[<><span className="glyph shopper" />Shopper reads the plan</>, "Checks your fridge", "Writes one list"]} />
        <div className="stage-body agent-row">
          <div className="card agent shopper">
            <div className={"sprite-box" + (phase === "shopper" ? " talking" : phase === "ready" ? "" : " quiet")}>
              <PixelSprite {...CAST.shopper} size={88} label="Shopper, the grocery list helper" className={phase === "shopper" ? "" : "bob d1"} />
            </div>
            <h3><span className="glyph shopper" aria-hidden="true" />Shopper <KindChip kind="ai" /></h3>
            {shopperStatus}
            <p>Builds the grocery list from the Chef’s plan.</p>
          </div>
          <div>
            {phase === "ready" && plan ? (
              <>
                <div className="kpis">
                  <div className="kpi"><small>Dinners planned</small><b>{plan.length}</b><span>Mon to Sun</span></div>
                  <div className="kpi" style={{ ["--kpi" as string]: "var(--leaf)" }}><small>From your fridge</small><b>{used.size}</b><span>of {fridge.size} items used</span></div>
                  <div className="kpi" style={{ ["--kpi" as string]: "var(--orange)" }}><small>To buy</small><b>{list.length}</b><span>items, sample</span></div>
                </div>
                {list.length ? (
                  <ul className="list" aria-label="Grocery list">
                    {list.map((it) => (
                      <li key={it.id} className="fade-up">{it.name}<span className="for">for {it.meals} {it.meals === 1 ? "dinner" : "dinners"}</span></li>
                    ))}
                  </ul>
                ) : <div className="empty">✓ Nothing to buy. Your fridge covers the whole week.</div>}
              </>
            ) : (
              <div className="empty" role="status">{phase === "shopper" ? "The Shopper is checking the plan…" : "The list shows up after the Chef’s plan."}</div>
            )}
          </div>
        </div>
      </section>

      <div className="feed" aria-hidden="true" />

      {/* Stage 4 */}
      <section className="stage" id="approve" aria-labelledby="s4-title">
        <StageHeader n={4} titleId="s4-title" title="Approve your week" icon="✅" line="Nothing’s final until you say so."
          aside={<><KindChip kind="you" /><Tip about="approving your week" title="Why you approve" tone="var(--you-bar)" lines={[
            "The helpers suggest. You decide.",
            "Review the seven dinners and the list together.",
            "Change anything first: swap a day or edit your fridge.",
            "Any change after approving asks you again.",
          ]} /></>} />
        <div className="stage-body">
          <div className="card agent you decide">
            <PixelSprite {...CAST.you} size={64} label="You" className="bob d2" />
            <div>
              {approved ? <p className="stamp" role="status">✓ Approved</p>
                : <p className="big-line" role="status">{phase === "ready" ? "Your plan and list are ready to review." : "Waiting for the Chef and the Shopper."}</p>}
              <p>{approved ? "Your week is set. Take the list to the shop." : "You’ll see every dinner and every item before you agree."}</p>
            </div>
            <button type="button" className="btn primary" disabled={phase !== "ready"} onClick={() => setReviewing(true)}>
              {approved ? "Review again" : "Review and approve"}
            </button>
          </div>
        </div>
      </section>

      <Popup open={reviewing} onClose={() => setReviewing(false)} title="Approve this week?" tone={{ hue: "var(--you-soft)", bar: "var(--you-bar)" }}
        icon={<PixelSprite {...CAST.you} size={36} />}>
        <div className="review">
          <div>
            <h3><span className="glyph chef" aria-hidden="true" />Chef’s dinners <KindChip kind="ai" /></h3>
            <ol>{plan?.map((id, i) => <li key={DAYS[i]}><span className="mono">{DAYS[i]}</span>{recipe(id).icon} {recipe(id).name}</li>)}</ol>
          </div>
          <div>
            <h3><span className="glyph shopper" aria-hidden="true" />Shopper’s list <KindChip kind="ai" /></h3>
            <ul>{list.length ? list.map((it) => <li key={it.id}><span className="mono">×{it.meals}</span>{it.name}</li>) : <li>Nothing to buy</li>}</ul>
          </div>
        </div>
        <p className="pop-note">Sample plan and list, made-up.</p>
        <div className="pop-actions">
          <button type="button" className="btn primary" onClick={() => { setApproved(true); setReviewing(false); }}>✓ Approve plan</button>
          <button type="button" className="btn" onClick={() => setReviewing(false)}>Keep editing</button>
        </div>
      </Popup>
    </div>
  );
}
