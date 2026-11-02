# Drawing the cast

There is no stock cast. Every page gets characters drawn from its own brief, using one method, one set of rules and one vocabulary of cues. This file is that method. `pixel-art.md` covers the sprite format and `motion.md` covers how sprites move.

## Contents
- The method in seven steps
- Grid, colours and slots
- Body plans
- Role cues
- AI, You and Code
- Expressions and states
- Keeping the cast consistent
- Worked example
- What to avoid

## The method in seven steps

1. Read the brief and list the actors. An actor is something the brief says acts: an AI helper, the user, a named tool or a mascot it asks for. Data, places and objects that only get acted on (shops, files, parcels) are scenery, not actors. If the brief has no actors, the cast is one mascot.
2. Give each actor a one-line job in the form "verb + object" taken from the brief's own words ("reads the fault description", "finds the part").
3. Pick a body plan for each actor from the five below. Spread them out. Three actors should use three plans.
4. Pick a role cue for the verb (a prop, a head shape, a badge) from the table. The cue is what makes the sprite say its job.
5. Assign palette slots. The actor colour comes from the chosen theme, and everything else uses the shared slots.
6. Draw the 16 x 16 grid, starting with the outline, then the fills, then the face, then the cue.
7. Check it. Run the check script, look at the silhouettes at 24px, then put the sprite beside its name and tag. If you can't tell two actors apart with the colour removed, redraw the one with the weaker silhouette.

## Grid, colours and slots

`assets/pixel-sprites.js` draws every symbol on a 16 x 16 grid (its `viewBox` is fixed). Plan around that.

| Use | Art size inside the grid | Rendered at | Notes |
|---|---|---|---|
| Prop or badge (a bag, a lens, a status mark) | 8 to 12 px, centred | 24 to 32px | One or two fills. For one-colour UI glyphs use a pixel icon instead |
| Actor, standard | 12 to 14 wide, 14 to 16 tall | 48 to 96px | The default for every cast member |
| Actor, hero | the same 16 x 16 grid | 128 to 192px | Scale it with CSS. Don't add detail, because crisp big pixels are the look |
| Rich hero (optional) | 24 x 24 | 160 to 224px | Only if a face needs more than 16 px. Copy the helper into the project and change both the `viewBox` and the `x < 8` split to use the row length. Keep every actor at the same size |

Rules for every sprite:
- Outline in `#16171a`, one pixel wide, closed all the way round. Don't outline in a darker shade of the fill.
- Outline plus three to five fills. Counting the eye, signal and cue colours, seven keys at most. More colours turn to mush at 48px.
- Light comes from the top left. Put one `h` highlight run on the upper left of the largest mass, and one `A` shade run on the lower right. No third tone on the same surface.
- Feet or base sit on row 15 for every actor, so a cast lines up on one baseline.
- Face details are one pixel. Eyes are one or two pixels each, a mouth is two. Anything finer vanishes at 24px.
- Leave the sprite symmetric unless the asymmetry is the cue (a bag on one side).

### Palette slots

Use the same key letters in every sprite, so a theme change is a palette swap. Each actor gets its own palette object with these keys, and one `pixelSprites` call per actor.

| Key | Slot | Typical value |
|---|---|---|
| `k` | Outline | `#16171a`, always |
| `a` | Main fill, the actor colour | A character hue from the theme (`themes.md`) |
| `A` | Shade, also used for hair, trousers and feet | The main fill darkened about 25% |
| `h` | Highlight | The main fill lightened about 30% |
| `s` | Skin or neutral | `#f1c7a3` for people, a pale neutral otherwise |
| `v` | Hands or limbs that move | The same colour as `s` or `a`. A separate key lets CSS wave them |
| `w` | White, such as paper, lens glass, belly patch | `#ffffff` |
| `e` | Eyes | `#16171a` on light faces, a light tint on dark visors. A separate key lets CSS blink them |
| `y` | Signal pixel | The theme's highlight colour. The same on every AI helper |

Add extra keys (`B` for a bag, `H` for hair) only when a cue needs its own colour.

Which pixels move:
- `y` blinks with `px-blink`.
- `v` waves with `px-wl` and `px-wr` (the helper splits left and right at column 8, so keep mirrored limbs symmetric).
- `e` blinks. Add this to the page CSS and map `e: 'px-eye'` in `animate`:
```css
.px-eye { transform-box: fill-box; transform-origin: center; animation: px-eyes 5s steps(1) infinite; }
@keyframes px-eyes { 0%, 96%, 100% { transform: none; } 97%, 99% { transform: scaleY(.15); } }
```
- Bob, hop and shake move the wrapper element around the `<svg>`, never the pixels. That also lets the feet stay on row 15.

## Body plans

Five plans cover most briefs. Each grid below is a generic demonstration of the plan with the shared slots, not a character to reuse. Draw your own proportions, props and faces.

| # | Plan | Head to body | Reads at 24px by | Use for |
|---|---|---|---|---|
| 1 | Person | 1 : 1 (big head, short body) | hair or hat shape on top, two legs | The user, a human role the brief names |
| 2 | Small creature | head about 40% of the height, body and legs below | ears or horns on top, a tail or side bag | Helpers that run, fetch, sniff out or watch |
| 3 | Robot or device | 1 : 1, boxy | antenna, wide square head, wheel or leg stubs | AI helpers that analyse, read, plan or monitor |
| 4 | Object as character | face on 60% of the body | the whole outline of the object (lid, handle, spout) | Tools, stores and rule keepers: a jar, a ledger, a lamp |
| 5 | Blob or spirit | the body is the head | a point or crest on top, no limbs | Abstract processes, moods, a mascot with no species |

### 1 Person

Round head, one hair mass, a torso a little wider than the head's base and two short legs. Hands use `v`.

```js
'plan-person': [
  '................', '.....kkkkkk.....', '....kAAAAAAk....', '...kAAAAAAAAk...',
  '...kAssssssAk...', '...ksessssesk...', '...kssskksssk...', '....kssssssk....',
  '.....kkkkkk.....', '...kaaaaaaaak...', '..kaaaaaaaaaak..', '..kaaaaaaaaaak..',
  '..kvaaaaaaaavk..', '..kkaaaaaaaakk..', '....kAAk..kAAk..', '....kkkk..kkkk..'
],
```

### 2 Small creature

Ears give the top outline, so they must stand clear of the head. The tail sits low on one side. The pale patch breaks up the body.

```js
'plan-creature': [
  '................', '................', '...kk......kk...', '..kaak....kaak..',
  '..kaaakkkkaaak..', '..kaaaaaaaaaak..', '..kaaeaaaaeaak..', '..kaaaakkaaaak..',
  '...kaaaaaaaak...', '..kaaawwwwaaak..', '..kaaawwwwaaakk.', '..kaaawwwwaaakAk',
  '..kaaaaaaaaaakAk', '...kaaaaaaaak.kk', '...kaakkkkaak...', '...kkkk..kkkk...'
],
```

### 3 Robot or device

Boxy head, visor for a face, an antenna for the `y` signal and a chest light. Arms are two-pixel stubs.

```js
'plan-robot': [
  '.......yy.......', '.......kk.......', '..kkkkkkkkkkkk..', '..kaaaaaaaaaak..',
  '..kakkkkkkkkak..', '..kakeekkeekak..', '..kakkkkkkkkak..', '..kaaaaaaaaaak..',
  '..kkkkkkkkkkkk..', '..kaaaaaaaaaak..', '..kaaaaaaaaaak..', 'vvkaaakyykaaakvv',
  '..kaaaaaaaaaak..', '..kkkkkkkkkkkk..', '...kAAk..kAAk...', '...kkkk..kkkk...'
],
```

### 4 Object as character

Take the object's most recognisable outline (here a lid with a knob) and put a face on the biggest flat area. Limbs are optional stubs. The object's outline matters more than the face.

```js
'plan-object': [
  '................', '................', '................', '......kkkk......',
  '...kkkhhhhkkk...', '..khhhhhhhhhhk..', '..kkkkkkkkkkkk..', '..kaaaaaaaaaak..',
  '..kaaeaaaaeaak..', '..kaaeaaaaeaak..', 'vvkahaaaaaahakvv', '..kaaaakkaaaak..',
  '..kaaaaaaaaaak..', '..kAAAAAAAAAAk..', '..kkkkkkkkkkkk..', '...kk......kk...'
],
```

### 5 Blob or spirit

One rounded mass narrowing to a point, a highlight on the upper left and a base that bulges out. The `y` sparkle floats beside it.

```js
'plan-blob': [
  '................', '.......kk.......', '......kaak...y..', '.....kahaak.....',
  '....kahaaaak....', '...kahaaaaaak...', '...kaaaaaaaak...', '..kaaaeaaeaaak..',
  '..kaaaeaaeaaak..', '..kahaaaaaahak..', '..kaaaakkaaaak..', '..kaaaaaaaaaak..',
  '..kAaaaaaaaaAk..', '...kAAaaaaAAk...', '....kkAAAAkk....', '.....kkkkkk.....'
],
```

Mixing plans: a person with a robot head, or a creature carrying a device, is fine when the brief calls for it. Keep one plan dominant so the silhouette stays readable.

## Role cues

An actor's verb decides its cue. Pick one main cue (a prop or a head or body shape) and at most one small extra. Cues are drawn in 3 to 6 pixels, so they must be a clear shape, such as a ring, a bar, a flag or a box.

| The actor... | Prop or body cue | Head or worn cue | Motion or posture |
|---|---|---|---|
| plans, schedules | clipboard, calendar page | pencil stub beside the head | prop dips 1px as it writes |
| checks, validates | magnifier, tick board, lens as the face | none | lens slides side to side |
| searches, finds | binoculars, torch | wide-set eyes | eyes shift left and right |
| fetches, delivers, ships | satchel, parcel, wheel | cap with a peak | leans forward, feet alternate |
| teaches, explains | pointer stick, chalk board | none | pointer taps |
| guards rules, blocks | shield, stop paddle | helmet band | stands square, shield flashes on a block |
| reads, parses | open book, scroll | two `w` pixels as glasses | page pixel flips |
| writes, drafts | pen, quill | none | pen tip `y` pixel flicks |
| translates, converts | pair of arrows, two speech tails | none | arrows swap sides |
| stores, remembers | box, jar, drawer | lid as the head | lid lifts a pixel |
| counts, budgets | coin stack, abacus | visor | one coin pixel hops |
| pays, bills | wallet, coin | none | coin pixel spins (two frames) |
| fixes, repairs | spanner | none | prop taps |
| builds, assembles | brick, hammer | hard hat | hammer swings 2 frames |
| measures | ruler, tape | none | tape extends one step |
| sorts, routes | signpost, arrow pair | arrow badge on the chest | arrows point to the target |
| matches, negotiates | two-way arrow badge | none | tilts toward whoever speaks |
| watches, monitors | dish, periscope | antenna with a `y` tip | antenna blinks |
| reminds, alerts | bell | bell charm | bell shakes 2 frames |
| decides, approves | stamp | none | stamp thumps |
| protects, secures | padlock | key on a chain | padlock clicks shut |
| cleans, tidies | broom, cloth | none | sweeps 2 frames |
| cares, grows | watering can, leaf | leaf sprout on top | sprout rises a pixel |
| advises, supports | speech bubble, plus-sign badge in the actor colour | headset | nods (head drops 1px) |
| recommends, curates | star, flag, pin | star badge | star twinkles |
| guides, navigates | compass, lantern | none | lantern swings |
| sends, messages | envelope, speech bubble | none | envelope hops |
| cooks, prepares | pan, spoon | apron | spoon stirs |
| is the human user | nothing: plain clothes, no prop | ordinary hair | the You tag does the rest |
| is plain code or a fixed rule | no face: a gate, ledger or plate as the whole body | none | no idle, flashes only when it decides |

If the verb isn't listed, find the object the verb works on and draw a tool a person would use on it. Keep to a generic prop. Don't use a real brand's tool, uniform or colours.

## AI, You and Code

Three kinds of actor must look different without colour. Use all four signals together.

| Signal | AI helper | You | Code or rules |
|---|---|---|---|
| Tag chip beside the sprite | `AI` | `You` | `Code` (only if the brief has a real non-AI step) |
| Face | eyes and a face | eyes, skin and hair | no face |
| Signal pixel (`y`) | always present, blinking | never | never |
| Body plan | robot, creature, blob or object | person | object only |
| Shape glyph | circle, hexagon or diamond | square | the same glyph in outline only |

Rules:
- Every AI helper carries the same `y` pixel colour, so the page reads "the sparkle means AI". Place it differently on each (antenna, between ears, beside the body).
- The user always uses plain clothes and no signal pixel. Don't give the user the page's brightest colour.
- A rule keeper or non-AI step is a faceless object. It doesn't bob or blink, and it flashes when it decides.
- The tag chip, the glyph and the name sit beside the sprite wherever it appears. The sprite alone never carries identity.

## Expressions and states

One grid serves every state. A state is a few swapped rows (usually the face rows, sometimes row 0 for a mark), registered as extra symbols that share the base grid. Don't redraw the body.

```js
const variant = (rows, edits) => rows.map((r, i) => edits[i] ?? r);
sprites['ch-you-happy'] = variant(sprites['ch-you'], { 0: '..y..........y..', 6: '...ksskkkkssk...', 7: '....ksskkssk....' });
// on a state change: el.querySelector('use').setAttribute('href', '#ch-you-happy')
```

| State | Pixel change | Person-plan row edits (indexes are rows from the top) | Motion |
|---|---|---|---|
| Idle | base grid, eyes blink through `e` | none | slow `bob` on the wrapper |
| Thinking | eyes move up one row, a `y` dot floats above the head | `{ 0: '...........y....', 4: '...kAesssseAk...', 5: '...kssssssssk...' }` | the dot blinks, the body stays still |
| Working | eyes look down one row, no mouth, hands or prop animate | `{ 5: '...kssssssssk...', 6: '...ksessssesk...' }` | `px-wl` and `px-wr` on `v`, or the prop wiggles. `hop` if this actor is the one speaking |
| Happy or done | a wide open smile, two `y` sparkles at the top corners | `{ 0: '..y..........y..', 6: '...ksskkkkssk...', 7: '....ksskkssk....' }` | one hop, then settle |
| Worried or error | a wobbly mouth, one `y` sweat pixel by the cheek | `{ 4: '...kAssssssAky..', 6: '...kssksksksk...' }` | shake the wrapper 1px for three frames, then hold. Pair with a word such as `Unclear` |
| Quiet or waiting | base grid | none | `opacity: .45` on the wrapper, no bob |

Plans without a face row use the same logic. Robots change the visor eyes (a flat line for working, a wide bar for done). Objects and blobs change the eye and mouth rows. A faceless Code object has no expressions, so use a flash (`filter: brightness(1.4)` for two frames) and a text mark `OK` or `Blocked`.

Always pair an expression with a word or a mark, such as `✓ Done`, `? Unclear` or `✕ Blocked`. Faces are too small to carry the state alone.

## Keeping the cast consistent

- Same grid size, same outline colour, same light direction and same baseline for every actor.
- Same slot letters. Every AI helper uses `y` for its signal. Every actor with eyes uses `e`.
- Actor colours come from the character hues in `themes.md`. Each main fill must stand out from the page background and from the other actors' fills.
- Two to four actors. The user counts as one. If the brief lists more, group them (three similar helpers become one "team" sprite) instead of drawing a crowd.
- Every actor uses a different top outline (hair, ears, antenna, lid, point). Add a second difference in width or props.
- Silhouette test. Fill every non-empty pixel with one colour, shrink to 24px and look at the shapes. If two silhouettes could be swapped without anyone noticing, change the top outline or add a prop. This script prints silhouettes and checks the grids:

```js
// node check-cast.js: paste in your palette and sprites
const bad = [];
for (const [id, rows] of Object.entries(sprites)) {
  if (rows.length !== 16) bad.push(`${id}: ${rows.length} rows`);
  rows.forEach((r, y) => {
    if (r.length !== 16) bad.push(`${id} row ${y}: ${r.length} wide`);
    for (const ch of r) if (ch !== '.' && !palette[ch]) bad.push(`${id} row ${y}: no palette key "${ch}"`);
  });
  console.log(id + '\n' + rows.map(r => r.replace(/[^.]/g, '#').replace(/\./g, ' ')).join('\n'));
}
console.log(bad.length ? bad.join('\n') : 'all grids ok');
```
- `lint_page.py` also fails rows of unequal width. Run both.
- Sprites that carry meaning get `role="img"` and an `aria-label`. Repeats beside a visible name are `aria-hidden`.
- Add the user last. Draw them after the AI helpers, give them the plainest plan, and put them where the journey starts and ends (at the first input and at the decision). Keep the user plain so the helpers read first.

## Worked example

Brief: "Spoke is a bike repair booking site. The rider describes what's wrong. A diagnosis AI reads it and names the likely fault. A parts AI finds the part and a nearby shop that has it in stock. The rider then picks a drop-off slot."

1. Actors. The diagnosis AI, the parts AI and the rider. Shops, parts and slots are things acted on, so they're scenery. Three actors.
2. Jobs. The diagnosis AI "reads the fault and names the cause". The parts AI "finds the part in stock". The rider "describes the fault and picks a slot".
3. Body plans. The diagnosis AI is a machine that analyses text, so robot (plan 3). The parts AI runs around fetching, so small creature (plan 2). The rider is a person (plan 1). Three actors, three plans, three different top outlines (antenna, ears, hair).
4. Role cues. "Checks" gives a magnifier, so the diagnosis AI's face is one big lens. Putting the cue in the face keeps it readable at 24px. "Fetches" gives a satchel, so the parts AI wears a coral bag on its right side, which also widens its silhouette. The rider gets no prop and plain clothes.
5. Palette slots. The theme is Glass, so the cast takes its character hues: teal for the diagnosis AI, yellow for the parts AI and mint for the rider. Both AI helpers carry the lime `y` pixel (antenna and chest light on the robot, a spark between the ears on the creature). The rider has none.
6. Draw. Outline first, then fills, then the face, then the cue. Each actor gets its own palette and one `pixelSprites` call.
7. Check. Silhouettes: a tall antenna on a wide box, two ears with a bag on the side, a rounded head on a narrow torso. All three differ at 24px. Tags: `AI` with a circle for the diagnosis AI, `AI` with a hexagon for the parts AI, `You` with a square for the rider.

```js
const base = { k: '#16171a', e: '#16171a', y: '#dbe86a' };
pixelSprites({
  palette: { ...base, a: '#8fd6df', A: '#4fa3b3', v: '#4fa3b3', w: '#eaf8fb' },
  animate: { y: 'px-blink', e: 'px-eye', v: ['px-wl', 'px-wr'] },
  sprites: {
'ch-diagnoser': [
  '.......yy.......', '.......kk.......', '..kkkkkkkkkkkk..', '..kaaaaaaaaaak..',
  '..kaaakkkkaaak..', '..kaakwwwwkaak..', '..kaakekwwkaak..', '..kaaakkkkaaak..',
  '..kkkkkkkkkkkk..', '..kaaaaaaaaaak..', 'vvkaaakyykaaakvv', '..kaaaaaaaaaak..',
  '..kkkkkkkkkkkk..', '...kAAk..kAAk...', '...kAAk..kAAk...', '...kkkk..kkkk...'
],
  },
});
pixelSprites({
  palette: { ...base, a: '#f6d877', w: '#fff6d6', B: '#f6b5a6', h: '#fde4de' },
  animate: { y: 'px-blink', e: 'px-eye' },
  sprites: {
'ch-finder': [
  '................', '.kk......kk.....', 'kaak.yy.kaak....', 'kaaakkkkkaaak...',
  'kaaaaaaaaaaak...', 'kaaeaaaaeaak....', 'kaaaakkaaaak....', '.kaaaaaaaak.....',
  '.kaaawwaaakkkkk.', '.kaaawwaaakBBBk.', '.kaaawwaaakBhBk.', '.kaaaaaaaakBBBk.',
  '.kaaaaaaaakkkkk.', '.kaakkkkaak.....', '.kaak..kaak.....', '.kkkk..kkkk.....'
],
  },
});
pixelSprites({
  palette: { ...base, a: '#a8e2bd', A: '#5a4636', s: '#f1c7a3', v: '#f1c7a3' },
  animate: { e: 'px-eye', v: ['px-wl', 'px-wr'] },
  sprites: {
'ch-you': [
  '................', '.....kkkkkk.....', '....kAAAAAAk....', '...kAAAAAAAAk...',
  '...kAAAssssAk...', '...ksessssesk...', '...kssskksssk...', '....kssssssk....',
  '.....kkkkkk.....', '...kaaaaaaaak...', '..kaaaaaaaaaak..', '..kaaaaaaaaaak..',
  '..kvaaaaaaaavk..', '..kkaaaaaaaakk..', '....kAAk..kAAk..', '....kkkk..kkkk..'
],
  },
});
```
```html
<span class="chip">AI</span> Diagnoser <svg class="sprite" viewBox="0 0 16 16" role="img" aria-label="Diagnoser, an AI helper"><use href="#ch-diagnoser"/></svg>
```

Read the result against the step list. If the parts AI and the rider were both small round heads, you would change the creature's top outline first (taller ears) before touching colour.

## What to avoid

- Real brands, logos, mascots, uniforms and liveries. Don't draw an existing game, film or app character, or a close copy, even as a joke.
- Stock figures built on stereotypes about gender, age, ethnicity, job or disability. Vary skin tones, hair and builds across a cast, and let the verb, not the person, supply the cue.
- Emoji or font glyphs standing in for characters. Draw the sprite.
- Adding actors the brief didn't describe, or a "Code" character when the brief has no real code step.
- More than seven keys per sprite, gradients, dither on a sprite, anti-aliased edges, one-pixel-wide outlines that break.
- Detail that vanishes at 24px: teeth, eyebrows, fingers, text on the sprite, thin props. Make the prop two pixels thick or drop it.
- Colour as the only difference between two actors.
- Reusing one body plan for the whole cast, or copying a grid from another page. Redraw from the brief each time.
