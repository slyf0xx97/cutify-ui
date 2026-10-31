# Security policy

## Reporting a problem

If you find a security problem in cutify-ui, please report it privately through GitHub: open the Security tab of this repository and choose "Report a vulnerability". Please don't open a public issue for it.

Include what you found, the file involved and the steps to reproduce it. I'll reply as soon as I can, and I'll credit you in the fix if you'd like.

## What matters most here

cutify-ui is a Claude skill: Markdown instructions, CSS and small JavaScript, TypeScript and Python helpers that Claude copies into other people's projects. A problem in any of them can end up in many sites, so these count as security bugs:

- A helper that turns untrusted text into HTML without escaping it (the skill tells Claude to pass every user or data string through `esc()` before `innerHTML`).
- The Streamlit bridge accepting a message in a way that lets a page run code or reach data it shouldn't. Messages are untrusted input and must be validated on the Python side.
- Instructions in `SKILL.md` or `references/` that would lead Claude to load scripts from unknown origins, store secrets in a page, or log user data.
- Anything in the repository that calls a network service other than Google Fonts.

## Supported version

Only the latest release on the `main` branch is supported.
