---
tags: [skill-creator]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Make an animated process flow (one HTML file, flow.html) that explains how a library book reservation works at our university: a student reserves a book, a hold-shelf system checks the rules (at most 5 holds, no unpaid fines over $10, the book isn't reference-only), a librarian pulls the book, and the student gets a pickup notice. Show one reservation moving through the steps, and one that gets blocked by a rule.
