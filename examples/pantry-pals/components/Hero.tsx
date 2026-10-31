import type { CSSProperties } from "react";
import { CAST } from "./data";
import { KindChip } from "./KindChip";
import { PixelSprite } from "./PixelSprite";

const at = (x: number, y: number, w?: number) => ({ "--x": `${x}cqw`, "--y": `${y}cqw`, ...(w ? { "--w": `${w}cqw` } : {}) }) as CSSProperties;

export function SiteHeader() {
  return (
    <header className="site-header glass wrap">
      <a className="brand" href="#top">
        <PixelSprite {...CAST.chef} size={30} />
        Pantry Pals
      </a>
      <nav className="site-nav" aria-label="Main">
        <a className="nav-link" href="#how-it-works">How it works</a>
        <a className="btn primary small" href="#fridge">Plan my week</a>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero glass wrap" id="top" aria-labelledby="hero-title">
      <div>
        <div className="badge-line">
          <span className="tag">Meal planner</span>
          <span className="tag sample">Sample data, made-up</span>
        </div>
        <h1 id="hero-title">Pantry <span className="hl">Pals</span></h1>
        <p className="tagline">Two AI helpers plan your week from what’s already in your fridge. You get the final say.</p>
        <ul className="benefits">
          <li>Cook with what you already have</li>
          <li>One grocery list for the whole week</li>
          <li>Nothing’s final until you approve</li>
        </ul>
        <div className="hero-actions">
          <a className="btn primary big" href="#fridge">
            <span>▶ Plan my week</span>
            <small>Starts with a sample fridge</small>
          </a>
          <span className="pill">AI suggests <span aria-hidden="true">→</span> You approve</span>
        </div>
      </div>

      <div>
        <div className="scene" role="img" aria-label="The Chef takes food from the fridge and passes a meal plan to the Shopper, who hands you the grocery list.">
          <svg className="scene-bg" viewBox="0 0 400 300" aria-hidden="true">
            <rect width="400" height="300" fill="#eaf7fb" />
            {[22, 302].map((x) => (
              <g key={x}>
                <rect x={x} y="22" width="76" height="66" rx="6" fill="#bfe6f6" stroke="#1f2430" strokeWidth="4" />
                <ellipse cx={x + 30} cy="50" rx="16" ry="6" fill="#fff" />
                <path d={`M${x + 38} 22v66M${x} 55h76`} stroke="#1f2430" strokeWidth="3" />
              </g>
            ))}
            <rect y="248" width="400" height="52" fill="#fcefc2" />
            <path d="M0 274h400M40 248v52M120 248v52M200 248v52M280 248v52M360 248v52" stroke="#e9d48f" strokeWidth="2" />
            <path d="M0 248h400" stroke="#1f2430" strokeWidth="3" />
            <ellipse cx="68" cy="257" rx="38" ry="6" fill="rgb(31 36 48 / 16%)" />
            <ellipse cx="332" cy="257" rx="38" ry="6" fill="rgb(31 36 48 / 16%)" />
            <rect x="148" y="40" width="104" height="210" rx="14" fill="#fff" stroke="#1f2430" strokeWidth="4" />
            <path d="M148 104h104" stroke="#1f2430" strokeWidth="3" />
            <rect x="234" y="60" width="7" height="30" rx="3" fill="#1f2430" />
            <rect x="234" y="116" width="7" height="52" rx="3" fill="#1f2430" />
            <rect x="160" y="52" width="6" height="36" rx="3" fill="#d9f0fb" />
            <rect x="160" y="116" width="6" height="70" rx="3" fill="#d9f0fb" />
            <circle cx="214" cy="60" r="6" fill="#f6b5a6" stroke="#1f2430" strokeWidth="2" />
            <rect x="182" y="54" width="12" height="12" rx="2" fill="#8fd6df" stroke="#1f2430" strokeWidth="2" />
            <g transform="rotate(-6 186 150)">
              <rect x="170" y="128" width="34" height="42" rx="3" fill="#fcefc2" stroke="#1f2430" strokeWidth="2" />
              <path d="M176 140h22M176 148h22M176 156h14" stroke="#b9651a" strokeWidth="2" />
            </g>
            <rect x="160" y="248" width="14" height="6" fill="#1f2430" />
            <rect x="226" y="248" width="14" height="6" fill="#1f2430" />
          </svg>

          <div className="actor" style={at(17, 40, 24)}>
            <div className="hopper h1"><PixelSprite {...CAST.chef} size={96} className="bob" /></div>
          </div>
          <div className="actor" style={at(83, 40, 24)}>
            <div className="hopper h2"><PixelSprite {...CAST.shopper} size={96} className="bob d1" /></div>
          </div>
          <div className="actor" style={at(50, 57, 16)}>
            <div className="hopper h3"><PixelSprite {...CAST.you} size={64} className="bob d2" /></div>
          </div>

          <span className="fly f1" aria-hidden="true">🍅</span>
          <span className="fly f2" aria-hidden="true">📋</span>
          <span className="fly f3" aria-hidden="true">🧾</span>

          <span className="alab" style={at(17, 38)} aria-hidden="true"><span className="glyph chef" />Chef <KindChip kind="ai" /></span>
          <span className="alab" style={at(83, 38)} aria-hidden="true"><span className="glyph shopper" />Shopper <KindChip kind="ai" /></span>
          <span className="alab mid" style={at(74, 69)} aria-hidden="true"><span className="glyph you" /><KindChip kind="you" /> approve</span>
        </div>
        <ul className="legend" aria-label="Who does what">
          <li><span className="glyph chef" /> <b>Chef</b> <KindChip kind="ai" /> suggests recipes</li>
          <li><span className="glyph shopper" /> <b>Shopper</b> <KindChip kind="ai" /> builds the list</li>
          <li><span className="glyph you" /> <b>You</b> approve the week</li>
        </ul>
      </div>
    </section>
  );
}
