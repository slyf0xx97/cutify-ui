# Voice and labels

Copy in cutify-ui tells the visitor what to do and who did what, and it says plainly when something is made up.

## Rules

- Write in the second person with plain verbs: "Add a role and your résumé.", "Press start", "Nothing moves until you approve."
- Use sentence case for headings, buttons and labels. Themes with uppercase display titles (Apron, Riso Club's labels) still use plain words underneath ("Pick your cravings", "Approve your route").
- Make stage titles short imperatives in the order the user meets them: "Fill your fridge", "Pick a level", "Approve the week".
- Give the hero a two-word name, one line saying what it does, up to three short benefits with ✓ ("Cook with what you have", "One list for the week") and one primary action with a small subtitle ("Starts with a sample fridge").
- Say who does what. Tag AI and You (and Code only when there's a real non-AI step), and write it into the copy too: "The Chef suggests, you decide".
- Put plain words first and codes second: "Blocked: this aisle already has two robots" next to `AISLE-01` in mono.
- Pair every status mark with a word: `✓ Accepted`, `✕ Ignored`, `↺ Asks for a change`, `? Unclear`, `Working…`, `Done`. Results read like a sentence: "✓ Menu confirmed for 8 guests", "! Two dishes still unclaimed".
- Say where data comes from: "Sample result for a made-up candidate", "Wait time, estimate", "Prices are made up for this demo." Never present made-up numbers as real.
- Make tooltips explain why. Start with a title, then 3 to 8 short lines, and end with the reason: "Why a helper: your cravings are words, not stall numbers."
- Error messages say what failed and what still works: "The live suggestion failed. The sample plan still works." "The news lookup didn't work this time. Try again later."
- Set data in mono: IDs, times (24-hour), numbers with thousands separators and signed deltas (`−1.2 min`).
- Get the typography right: a real ellipsis `…`, curly apostrophes, `✕` on Close, and accents where they belong (résumé).
- Keep theme flavour to micro-copy. Each theme can lend a few words that fit the product: a journey for Glass ("Stage 1", "Level up"), signage for Apron ("Floor 2, live view"), a picnic for Picnic ("Jar lid 1"), print for Riso Club ("Issue 01"), the market for Lantern Night ("Lantern 3") and toys for Toy Box ("Brick 2"). The core message stays plain either way.
- When a label is shortened to fit, keep the full name in `aria-label`.

## Avoid

- Marketing filler ("seamless", "revolutionary", "unlock") and exclamation marks on every line.
- Questions as headings ("What does it do?"). State the answer instead.
- Middle-dot separators in labels and metadata (`A · B`). Use commas, line breaks or separate chips.
- Bold-label bullets in UI copy ("**Fast**: ..."). Use the icon + lead + line pattern instead.
