# Security policy

## Reporting a problem

If you find a security vulnerability in cutify-ui, please report it privately. Please don't open a public issue for it.

- Use GitHub's private reporting: open the [Security tab](https://github.com/slyf0xx97/cutify-ui/security/advisories/new) and choose "Report a vulnerability".
- Or email hello@ghernie.com with "cutify-ui security" in the subject.

Include what you found, the file involved and the steps to reproduce it.

## What happens next

1. I'll acknowledge your report within 3 days.
2. I'll confirm the problem and agree a fix date with you, aiming for 30 days at most.
3. I'll release the fix, then publish a GitHub security advisory that describes the vulnerability and credits you, unless you'd rather stay anonymous.

Please give me that time before disclosing the problem publicly. If a fix needs longer, I'll tell you why and agree a new disclosure date with you.

## What matters most here

cutify-ui is a Claude skill: Markdown instructions, CSS and small JavaScript, TypeScript and Python helpers that Claude copies into other people's projects. A problem in any of them can end up in many sites, so these count as security bugs:

- A helper that turns untrusted text into HTML without escaping it (the skill tells Claude to pass every user or data string through `esc()` before `innerHTML`).
- The Streamlit bridge accepting a message in a way that lets a page run code or reach data it shouldn't. Messages are untrusted input and must be validated on the Python side.
- Instructions in `plugin/skills/cutify-ui/SKILL.md` or its `references/` that would lead Claude to load scripts from unknown origins, store secrets in a page, or log user data.
- Anything in the repository that calls a network service other than Google Fonts.

## Supported version

Only the latest release on the `main` branch is supported.
