# Voice and labels

Words in cutify-ui are short, plain and honest. They tell the visitor what to do, who did what, and what's real.

## Rules

- **Second person, plain verbs.** "Add a role and your résumé.", "Press start", "Nothing moves until you approve."
- **Sentence case** for headings, buttons and labels in Glass. Apron uses uppercase display titles, but the words are still plain ("Read the ops inbox", "Your decision").
- **Stage titles are short imperatives** in the order the user meets them: "Read the inbox", "The agents negotiate", "Your decision".
- **Hero**: a two-word name, one line saying what it does, three short benefits with ✓ ("Save fuel & time", "Fly on time"), one primary action with a small subtitle ("See how it works in operation").
- **Who did what.** Tag AI, Code and You. Write it into copy too: "AI reads → Code checks → You approve".
- **Plain words first, codes second.** "Blocked: aircraft too close on the runway" next to `WAKE-01` in mono.
- **Status = mark + word.** `✓ Accepted`, `✕ Ignored`, `↺ Asks for a change`, `? Unclear`, `Working…`, `Done`. Results read like a sentence: "✓ All three agree, round 2", "! No deal, code builds a backup plan".
- **Honest provenance.** "Recorded 2015", "Sample result for a made-up candidate", "kg CO₂, estimate", "Fuel uses made-up burn rates, so fuel and CO₂ are estimates." Never present made-up numbers as real.
- **Tooltips explain why.** Title, then 3 to 8 short lines. End with the reason: "Why an agent: priorities arrive as free text and change by the minute."
- **Errors say what failed and what still works.** "The live run failed. The recorded scenario still works." "The news lookup didn't work this time. Try again later."
- **Mono for data.** IDs, times (24-hour), numbers with thousands separators, signed deltas (`−1.2 min`).
- **Typographic care.** Real ellipsis `…`, curly apostrophes, `✕` on Close, accents where they belong (résumé).
- **Theme flavour in micro-copy only.** Glass borrows a journey ("Stage 1", "Level up", camp, summit). Apron borrows signage when the product is about aviation ("Taxiing to ORD", "RWY 28R"). Keep the core message plain either way.
- **Labels shrink, names don't.** When a label is shortened for width, keep the full name in `aria-label`.

## Avoid

- Marketing filler ("seamless", "revolutionary", "unlock"), exclamation marks on every line.
- Questions as headings ("What does it do?"). State it.
- Middle-dot separators in labels and metadata (`A · B`). Use commas, line breaks or separate chips.
- Bold-label bullets in UI copy ("**Fast**: ..."). Use the icon + lead + line pattern instead.
