import { Hero, SiteHeader } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Planner } from "../components/Planner";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Planner />
        <HowItWorks />
      </main>
      <footer className="footer glass wrap">
        <div>
          <h5>Pantry Pals</h5>
          <p>A sample meal planner. The Chef suggests dinners from your fridge, the Shopper builds the list, and you approve the week.</p>
        </div>
        <div>
          <h5>Data</h5>
          <ul><li>Sample fridge, made-up</li><li>10 made-up recipes</li></ul>
        </div>
        <div>
          <h5>Built with</h5>
          <ul><li>Next.js and React 19</li><li>Plain CSS, no Tailwind</li><li>cutify-ui Glass theme</li></ul>
        </div>
        <div>
          <h5>Project</h5>
          <ul><li>An example for the cutify-ui skill</li></ul>
        </div>
        <div className="copy">
          <p>Sample page. The helpers here follow a script, not a live AI model.</p>
          <a className="donate" href="https://donate.stripe.com/00w4gr2TU7wC52iaXf18c01" target="_blank" rel="noopener noreferrer">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16" shapeRendering="crispEdges"><path fill="currentColor" d="M3 3h3v1h1v1h2V4h1V3h3v1h1v4h-1v1h-1v1h-1v1h-1v1H9v1H7v-1H6v-1H5V9H4V8H3V7H2V4h1z" /></svg>
            Support cutify-ui<span className="sr-only"> (opens Stripe in a new tab)</span>
          </a>
        </div>
      </footer>
    </>
  );
}
