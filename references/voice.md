# Voice and labels

Words in cutify-ui are short, plain and honest. They tell the visitor what to do, who did what, and what's real.

## Rules

- **Second person, plain verbs.** "Add a role and your résumé.", "Press start", "Nothing moves until you approve."
- **Sentence case** for headings, buttons and labels. Themes with uppercase display titles (Apron, Riso Club's labels) still use plain words underneath ("Pick your cravings", "Approve your route").
- **Stage titles are short imperatives** in the order the user meets them: "Fill your fridge", "Pick a level", "Approve the week".
- **Hero**: a two-word name, one line saying what it does, up to three short benefits with ✓ ("Cook with what you have", "One list for the week"), one primary action with a small subtitle ("Starts with a sample fridge").
- **Who does what.** Tag AI and You (and Code only when there's a real non-AI step). Write it into copy too: "The Chef suggests, you decide".
- **Plain words first, codes second.** "Blocked: this aisle already has two robots" next to `AISLE-01` in mono.
- **Status = mark + word.** `✓ Accepted`, `✕ Ignored`, `↺ Asks for a change`, `? Unclear`, `Working…`, `Done`. Results read like a sentence: "✓ Menu confirmed for 8 guests", "! Two dishes still unclaimed".
- **Honest provenance.** "Sample result for a made-up candidate", "Wait time, estimate", "Prices are made up for this demo." Never present made-up numbers as real.
- **Tooltips explain why.** Title, then 3 to 8 short lines. End with the reason: "Why a helper: your cravings are words, not stall numbers."
- **Errors say what failed and what still works.** "The live suggestion failed. The sample plan still works." "The news lookup didn't work this time. Try again later."
- **Mono for data.** IDs, times (24-hour), numbers with thousands separators, signed deltas (`−1.2 min`).
- **Typographic care.** Real ellipsis `…`, curly apostrophes, `✕` on Close, accents where they belong (résumé).
- **Theme flavour in micro-copy only.** Let each theme lend a few words that fit the product: a journey for Glass ("Stage 1", "Level up"), signage for Apron ("Floor 2, live view"), a picnic for Picnic ("Jar lid 1"), print for Riso Club ("Issue 01"), the market for Lantern Night ("Lantern 3"), toys for Toy Box ("Brick 2"). Keep the core message plain either way.
- **Labels shrink, names don't.** When a label is shortened for width, keep the full name in `aria-label`.

## Avoid

- Marketing filler ("seamless", "revolutionary", "unlock"), exclamation marks on every line.
- Questions as headings ("What does it do?"). State it.
- Middle-dot separators in labels and metadata (`A · B`). Use commas, line breaks or separate chips.
- Bold-label bullets in UI copy ("**Fast**: ..."). Use the icon + lead + line pattern instead.
