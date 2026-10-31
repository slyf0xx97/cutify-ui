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
        <p className="copy">Sample page. The helpers here follow a script, not a live AI model.</p>
      </footer>
    </>
  );
}
