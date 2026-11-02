# Story templates

Twelve reusable outlines for the stages of a cutify-ui page. A template gives you the shape of the story (who acts, what each stage must show, what "Play sample" does). You still write the real copy, names and numbers from the brief.

## Contents
- How to choose
- Using a template
- 1 Agents propose, rules check, you approve
- 2 Onboarding to a first win
- 3 Approval workflow with branches
- 4 Checkout or booking
- 5 Order or delivery tracking
- 6 Pipeline (CI/CD or data)
- 7 Process training, station by station
- 8 App prototype walkthrough
- 9 Before and after comparison
- 10 Planner or scheduler
- 11 Practice loop
- 12 Event or schedule page

## How to choose

Match the brief's main verb, then open the template. Templates can be combined (a booking page with a tracking stage at the end, a planner whose last stage is an approval). Take the stages of the main template and borrow one or two stages from another. Keep the whole journey to three to six numbered stages, as in SKILL.md.

The cast always comes from the brief. The roles below are generic labels to help you place actors, not characters to add. If the brief has no AI, drop the AI roles and use a mascot plus the user's own steps. If it has no rules, drop the rules role.

| Brief keywords | Template |
|---|---|
| agents, helpers, rules, safety, "approves the plan" | 1 Agents propose, rules check, you approve |
| first run, setup, welcome, getting started, goal | 2 Onboarding to a first win |
| claim, request, review, sent back, flagged, sign-off | 3 Approval workflow with branches |
| checkout, cart, book, reserve, pre-order, pay | 4 Checkout or booking |
| tracking, delivery, courier, ETA, status, route | 5 Order or delivery tracking |
| CI/CD, build, deploy, ETL, stages that can fail, logs | 6 Pipeline |
| training, new staff, onboarding a team, station, SOP | 7 Process training |
| prototype, screens, flow, phone, clickable | 8 App prototype walkthrough |
| faster, saves, improvement, versus, baseline | 9 Before and after comparison |
| timetable, plan the week, route planner, suggest | 10 Planner or scheduler |
| levels, hints, quiz, drills, streak, practice | 11 Practice loop |
| talks, rooms, agenda, fair, meetup, venue | 12 Event or schedule page |

## Using a template

1. Pick the template, then write the real stage titles as short imperatives in the user's words ("Approve the week", not "Approval").
2. Map the generic cast roles onto the actors in the brief. Give each a sprite, one colour and one shape cue, as in SKILL.md.
3. Drop stages the brief has no content for. A template with four honest stages beats six padded ones.
4. Write the "Play sample" as one button that runs the whole journey. Pressing it twice must restart cleanly (Engine 1 handles this).
5. Build the reduced-motion version at the same time as the animation, since it is a finished state and not a missing one.

Common combinations:

| Brief | Combine |
|---|---|
| Meal planner where the user approves | 10 for the plan, 1 for the rules and approval stage |
| Bakery with pre-orders and delivery | 4 for the order, 5 for the tracking stage |
| Savings app pitch | 8 for the phone, 2 for the first-run stage |
| Ops dashboard that proves a gain | 1 for the negotiation, 9 for the result stage |

Each template lists stage "must show" items. A stage can show more, but it should never show less. Every stage also keeps the standard parts from SKILL.md: one number, an imperative title, an `i` tooltip that says why, and an optional explain strip. Names in the "Components" lines are the headings in `components.md`. Names in the "Play sample" lines are the headings in `motion.md`.

## 1 Agents propose, rules check, you approve

- **Use it when** AI helpers draft something, a fixed set of checks can block it and a person signs off. Briefs: "three robots coordinate the order queue, a rules engine blocks unsafe plans, the shift manager approves" (fleet-queue), "a forecaster and a dispatcher plan the evening, a safety layer keeps limits" (gridline), "a planner, a quizzer and a coach, the student approves the week" (studybuddy).
- **Cast roles** proposer AI (one or two helpers), rules (plain code, only if the brief has real checks), You.
- **Stages**
  1. Set the situation. The input the helpers work from (the queue, the forecast, the mood), with a sample label.
  2. Watch the helpers propose. Each helper's contribution as a short bubble in its own colour, tagged AI.
  3. See the rules check it. One row per rule ID with a plain sentence, and the draft's result next to each. At least one rule blocks the first draft, so the check visibly matters.
  4. Read the fixed plan. The changed draft, with what changed and which rule caused it.
  5. Approve it. A native dialog that names what you are committing to.
- **Play sample** Engine 3: hand-offs with the Web Animations API flies a note from helper to helper, then to the rules board. Engine 1: scripted story with cancellable sleeps sequences the stages and scrolls to each. The speaking sprite uses `hop` while the others dim. A blocked draft uses `shake`, the approval uses `stamp`.
- **Components** Kind chips and agent labels, Chat box, Rule rows, Dialog, Pills, chips, meters, Connectors.
- **Label** Rule IDs in mono (`AISLE-01`, `BATT-02`) beside the plain line saying what each blocks. Counts, times and plans are "sample".
- **Reduced motion** Show the final transcript, the blocked row already marked `.hit` and the fixed plan. Keep Play, disabled with a `title` that explains why. Approve still works.
- **Common mistake** Letting an AI helper decide legality. Rules are code, the helpers only propose, and the cast has no invented "checker" character unless the brief names one.

## 2 Onboarding to a first win

- **Use it when** the page should show how a new user gets from sign-up to the first useful result. Briefs: "a plant-care companion for people who keep killing houseplants" (sprout), "a sleep journal that suggests one small change" (snooze-log), "a savings app for kids, starting with a goal".
- **Cast roles** mascot (the thing that visibly improves), helper AI (optional), You.
- **Stages**
  1. Tell it about you. The two or three questions it really asks, with sample answers filled in.
  2. Pick one goal. A short list of choices, one selected, with what the choice changes.
  3. Do the first small action. The smallest step that gives a result (water the plant, log a bedtime).
  4. See the first win. The mascot reacts, one number moves, the next step is named.
  5. Come back tomorrow. What reminds the user and what they will see next. Skip it if the brief has no return loop.
- **Play sample** Engine 1: scripted story with cancellable sleeps ticks the answers in and ends on the win. The mascot uses Idle pet blink and a stepped `hop` on the win. For a growing thing, swap sprite frames with `steps()` rather than scaling it.
- **Components** Step header and explain strip, Toggle switch, Buttons, Pills, chips, meters, Dialog (if a choice commits).
- **Label** Sample answers, sample progress. Do not show streaks or points the product does not have.
- **Reduced motion** The mascot sits in its happy frame, the win state is shown and stage 3 has a Next button that steps through by hand.
- **Common mistake** Showing every setting. Onboarding shows the shortest path to one win, so cut anything the first run does not need.

## 3 Approval workflow with branches

- **Use it when** items travel through a check and end in different places. Briefs: "expense claims go from a receipt to a policy check to a manager, one approved, one sent back, one flagged" (tally), "leave requests with manager sign-off", "content review before publishing".
- **Cast roles** requester (You or a sample person), checker (rules in plain code or a reviewer AI), approver (a named person).
- **Stages**
  1. Submit. The item and its fields, as the requester sees them.
  2. Get checked. One row per rule with a result per item, so each branch can point at its cause.
  3. Follow the branch. Three sample items take three paths: through, back to the requester, held for a decision. All three are visible at once or one at a time with a picker.
  4. Decide. The approver's queue with the held item and two or three real choices.
  5. See it land. The outcome (payout, publish, notice) and who did what, in order.
- **Play sample** Signature: a vehicle following a real path moves an item token (a receipt, a form) along the drawn process map. Each sample item takes its own branch, and the trail fills in with times and the Code or You tag. Use Engine 1: scripted story with cancellable sleeps to run the three items one after another.
- **Components** Rule rows, Pills, chips, meters, Dialog, Connectors, KPI tiles and fact chips.
- **Label** Rule IDs, `Recorded` for the audit trail, `sample` on amounts and names. Status always pairs a mark with a word (`✓ Approved`, `↺ Sent back`, `? Held`).
- **Reduced motion** All three branches are drawn in their end state with their trails complete. The picker still switches between items.
- **Common mistake** Every item taking the happy path. The page only explains the workflow if one item is stopped and the reason is visible.

## 4 Checkout or booking

- **Use it when** the visitor chooses something, confirms it and gets a receipt. Briefs: "a pre-order page for a bakery", "book a table or a workshop slot", "a ticket flow for a small event".
- **Cast roles** You, shopkeeper or host (mascot), helper AI (only if the brief has one, for example a suggester).
- **Stages**
  1. Pick. The options with real names and prices, labelled sample.
  2. Check. The basket or slot, the total, and any limit (stock, capacity, cut-off time) in a plain line.
  3. Confirm. A native dialog that restates what you are buying and what happens next.
  4. Get the receipt. What the visitor receives and when, with a reference ID in mono.
- **Play sample** Engine 1: scripted story with cancellable sleeps picks an item, opens the dialog and fills the receipt. The confirm uses Confetti burst. The picked item flies to the basket with Engine 3: hand-offs with the Web Animations API.
- **Components** Buttons, Dialog, KPI tiles and fact chips, Pills, chips, meters, Toggle switch (for options such as "gift box").
- **Label** Prices and stock are "made-up". The pay button says what it really does in the demo ("Place sample order").
- **Reduced motion** Skip the flight. The basket updates at once and the receipt shows an Approved badge with a glow ring in place of confetti.
- **Common mistake** A real-looking payment form. Never collect card details on a demo. Stop at a labelled sample confirmation.

## 5 Order or delivery tracking

- **Use it when** something moves along a route and the visitor watches its status. Briefs: "order tracking for a bakery that delivers by bike" (parcel-pigeon), "where is my parcel", "a pickup runner on a campus".
- **Cast roles** sender, carrier (a rider or courier sprite), receiver (You or a customer), planner AI (optional, for stop order).
- **Stages**
  1. Plan the stops. The stop list, and the planner's suggested order with what it saves (labelled estimate).
  2. Send off. A native dialog. After it, the stop order locks.
  3. Watch it travel. The map, the carrier moving, the status timeline with the current step lit.
  4. Arrive. The final status, the ETA reaching zero and what the receiver does.
- **Play sample** Signature: a vehicle following a real path moves the carrier along the drawn route. Status steps light as the carrier passes each stop. Use Engine 5: route with stops when the stops are cards in a vertical list. ETA text is plain content, not animation.
- **Components** Step header and explain strip, Pills, chips, meters, KPI tiles and fact chips, Connectors, Dialog.
- **Label** ETA and distances are "estimate". Orders, names and times are "sample". Timeline steps pair a mark and a word (`✓ Baked`, `… Out for delivery`).
- **Reduced motion** Do not mount the moving carrier. Place it at the current stop, show a Next stop button that advances status and ETA by hand.
- **Common mistake** Animating the carrier on a path that is not the drawn one. Draw the route once and reuse the same path for the movement.

## 6 Pipeline (CI/CD or data)

- **Use it when** work moves through ordered automated steps and can fail at one of them. Briefs: "a commit travelling through lint, build, tests and deploy" (ship-it), "how our nightly data job loads and checks a table", "how a photo is processed before it is published".
- **Cast roles** payload (a commit, a file, a record), one worker per step (plain automation, tagged Code), You (who reads the logs and fixes).
- **Stages**
  1. Start the run. The payload and the trigger.
  2. Pass the early steps. The cheap, fast checks first, each with its typical time (estimate).
  3. Meet the failure. One step fails and the later steps are marked skipped. The failing line is shown.
  4. Read the log. A short trimmed log with numbered notes saying which lines matter and why.
  5. Fix and rerun. The one-line fix and a second run that goes green to the end.
- **Play sample** Engine 1: scripted story with cancellable sleeps runs the red run, then the green one. The payload rides a conveyor with Signature: a vehicle following a real path. The active worker uses `hop`, a failure uses `shake`, success uses `stamp`.
- **Components** Rule rows (for the gates), Pills, chips, meters, Connectors, Kind chips and agent labels (Code), Tooltip (on log lines).
- **Label** Step names in mono, times as "estimate", log text as "Recorded" if it was captured, otherwise "sample log".
- **Reduced motion** Show both runs as static rows with the payload parked at the stopped step and a toggle between red and green.
- **Common mistake** Adding AI characters to a plain pipeline. If the brief says "no AI", every worker is Code and the page says so.

## 7 Process training, station by station

- **Use it when** new staff need to learn a physical or procedural flow. Briefs: "an animated process flow for training new staff at a ramen shop" (ramen-route), "how a returned item is handled in the warehouse", "opening checklist for a café".
- **Cast roles** the work item (an order, a tray), one station per step, You (the trainee).
- **Stages**
  1. Take the order. What starts the flow and the first handover.
  2. Walk the stations. One card per station: what to do, how long it takes, the usual mistake and its fix.
  3. Try rush hour. A Quiet and Busy switch that changes every station's time.
  4. See where it goes wrong. A ranked tally of the usual mistakes by station.
  5. Serve it. The finished item and the one thing to check before handover.
- **Play sample** Signature: a vehicle following a real path walks the work item station to station. Under the cards, use Engine 5: route with stops so the item stops at each card and marks passed cards done. A running clock is plain text. Engine 2: simulation clock with requestAnimationFrame fits when Busy adds tickets to the rail.
- **Components** Step header and explain strip, Toggle switch, Pills, chips, meters, Charts (time bars, stacked bar), KPI tiles and fact chips.
- **Label** Timings and mistake counts are "sample". Procedures are the user's own, so do not invent safety or hygiene rules.
- **Reduced motion** Place the item at the last station with every card marked done. Keep the Quiet and Busy switch, which changes numbers without motion.
- **Common mistake** Only showing the happy path. The training value is in the usual mistake per station and what to do about it.

## 8 App prototype walkthrough

- **Use it when** a designer or founder needs to show the screens of an app and how they connect. Briefs: "a clickable phone prototype for a kids' savings app" (pocket-money), "a booking app with six screens", "the three screens of a habit tracker".
- **Cast roles** You (the person tapping), one or two other people or helpers who appear in the screens, a mascot for the hero.
- **Stages**
  1. Open the app. The first screen in a phone frame, tappable.
  2. Do the main task. The two to four screens a user needs, each reachable by tapping.
  3. See the flow. A small diagram of the screens that lights up where you are and jumps the phone when you tap a box.
  4. Read the reasons. A numbered card per screen with the design reason behind it.
- **Play sample** Engine 1: scripted story with cancellable sleeps taps through every screen for you, with a fake finger or highlight moving to each tap area. The diagram connectors use `march` and the current box uses `live`. A switch outlines every tap area.
- **Components** Buttons, Toggle switch, Connectors, Step header and explain strip, Dialog (for confirmations inside the app), Tooltip.
- **Label** Screens show sample data. Say "prototype" in the hero so nobody thinks it is a live app.
- **Reduced motion** Disable the auto-play and keep manual tapping and the diagram jumps. The phone changes screen with no transition.
- **Common mistake** A phone frame that is only a picture. The screens must respond to taps, or this is the wrong template.

## 9 Before and after comparison

- **Use it when** the point of the page is that something got better and the visitor needs to see how. Briefs: "show the queue before and after the plan", "peak load with and without the battery", "a messy week against a planned week".
- **Cast roles** the same actors in two states, a referee (rules in code, or a metric), You.
- **Stages**
  1. Look at the problem. The "before" scene in its bad state, with the one number that shows it.
  2. Apply the change. What was done, by whom (AI, Code or You) and which rule or limit shaped it.
  3. Look at the result. The "after" scene beside or under the first, driven by the same clock.
  4. Check the gain. A small dashboard: the delta in mono with a sign (`−4 min`), and what it cost.
- **Play sample** Engine 2: simulation clock with requestAnimationFrame runs both scenes from one clock so the difference is fair. Add a spacing pass so objects in a queue never overlap. Reveal the dashboard with Stage pop-in.
- **Components** KPI tiles and fact chips, Charts, Rule rows, Pills, chips, meters, Kind chips and agent labels.
- **Label** Every figure is "sample" or "estimate". Show both axes' units. Do not claim the gain generalises.
- **Reduced motion** Freeze both scenes at the same late time, show the end numbers and keep a scrubber or Step button so the visitor can compare by hand.
- **Common mistake** Different data or a different clock on each side. The comparison only holds if both sides start from the same input.

## 10 Planner or scheduler

- **Use it when** the product builds a plan from the user's choices and the user approves it. Briefs: "a revision timetable from my exam dates and mood" (studybuddy), "a night-market crawl from my cravings and budget" (moonlit-market), "a route through 40 fair tables" (zine-night).
- **Cast roles** planner AI, a second helper (estimator, quizzer or similar, only if in the brief), rules (plain code, for clashes or limits), You.
- **Stages**
  1. Tell it what you want. The inputs (mood, cravings, topics) as chips or toggles.
  2. Watch it plan. The planner builds the schedule or route, with the helper's input passed across as a note.
  3. Check the clashes. Overlaps, budget or time limits as rule rows, with one resolved in front of the visitor.
  4. Edit if you want. One real edit the user can make (swap, skip, reorder).
  5. Approve the plan. A native dialog, then the plan locks or is exported.
- **Play sample** Engine 3: hand-offs with the Web Animations API passes the note between helpers. A route plan uses Self-drawing line to draw the path and Signature: a vehicle following a real path to walk a pixel visitor along it. Typing dots show a helper thinking.
- **Components** Chat box, Rule rows, Dialog, Pills, chips, meters, Toggle switch, Connectors.
- **Label** Waits, budgets, hours and distances are "sample" or "estimate". Rule IDs for each clash type.
- **Reduced motion** Draw the finished plan or route with the visitor parked at the end. Typing dots become a static "…" plus a live text line ("The Planner is thinking").
- **Common mistake** A plan that never changes between runs. Show one input changing the output, or the stage is decoration.

## 11 Practice loop

- **Use it when** the user learns by trying, getting a hint and levelling up. Briefs: "a coding playground for kids who guide a robot to a battery" (beep-and-build), "flashcard drills with spaced review", "typing practice with levels".
- **Cast roles** coach AI (hints, never answers), You, a progress object (a tower, a jar, a streak) that grows.
- **Stages**
  1. Pick a level. Levels with a clear goal and a locked state for the next one.
  2. Try it. A small playable area that really works for the sample levels.
  3. Get a hint. After a set number of failed tries, the coach gives a nudge and not the answer. State the number on the page.
  4. Level up. The progress object grows by one step and the next level unlocks.
- **Play sample** Engine 1: scripted story with cancellable sleeps runs one failed try, the hint and one success. The character moves step by step along the program using `steps()` timing. Level up uses Confetti burst, and the coach uses Typing dots while it thinks.
- **Components** Buttons (game buttons), Pills, chips, meters, Toggle switch, Dialog, Kind chips and agent labels.
- **Label** Levels and scores are "sample". Say what the hint rule is ("a hint after two tries").
- **Reduced motion** Run the program one step per button press and show the result at once. Level up shows a badge and a glow ring, not confetti.
- **Common mistake** A play area that only looks playable. Build at least the sample levels so a try can actually fail and succeed.

## 12 Event or schedule page

- **Use it when** the page tells people what happens where and when. Briefs: "the website for a two-day indie game-dev meetup" (pixel-fest), "a zine fair with 40 tables" (zine-night), "a school open day with a timetable".
- **Cast roles** a mascot host, speakers or table owners as simple sprites, You (the attendee), a helper AI only if the brief has one.
- **Stages**
  1. Know the event. Name, dates, place and one primary action, as the hero says.
  2. Find the schedule. Rooms or tracks as columns, sessions as cards, with a filter.
  3. Build your day. Star sessions and see clashes flagged in plain words.
  4. Find your way. A small venue map with the rooms labelled.
  5. Take it with you. A printable or saved list of your starred sessions.
- **Play sample** Engine 4: scroll-linked journey lets the host or a visitor walk a trail as the page scrolls, with the active day lit. A small playable item in the hero is allowed if the brief asks for it. Starring uses Sticker wobble. A day clock can run with Engine 2: simulation clock with requestAnimationFrame.
- **Components** Pills, chips, meters, Rule rows (for clashes), Toggle switch, KPI tiles and fact chips, Footer, Connectors.
- **Label** Speakers, rooms and times are "sample" unless the user supplied them. Times in 24-hour mono. Clash rule IDs (`CLASH-01`).
- **Reduced motion** The walker is parked at the current section. Stars and clashes update with no wobble.
- **Common mistake** Burying the primary action under the schedule. Dates, place and one action come first, and the grid is a stage, not the hero.
