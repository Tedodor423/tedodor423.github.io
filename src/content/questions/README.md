# The six HONEY questions — one file per question

`q1.md` … `q6.md` drive the map's question list and the cycle panel that
opens when a question is selected. Edit a file, save, done: no code
changes.

## Frontmatter

- `title` — the question, exactly as the team's table words it.
- One line per HONEY stage that has people: `hear`, `observe`, `navigate`,
  `evaluate`, `yield`. Each is a comma-separated list of conversation ids
  (the filenames in `../stakeholders/`). The map draws the question's loop
  through these people in stage order.
- A `*` after an id marks a conversation as central to this question: only
  those wear the stage letter badge on the map. Anchors from the team's
  table should normally carry one.
- A conversation tagged to this question (in its own file's `questions` /
  `anchors` / `provisional`) but listed in no stage here defaults to Hear —
  which is the write-up's own definition of the stage ("Hear —
  stakeholders"). Do not guess a later stage; a wrong one misstates the
  team's process.

## Body

One section per stage, these exact headings: `## Hear`, `## Observe`,
`## Navigate`, `## Evaluate`, `## Yield`. Each section's text appears in
the cycle panel beside the question list; hovering it picks that stage's
people out on the map. A stage with neither text nor people is skipped.

Keep each section to a short paragraph — the panel sits over the map. Plain
Markdown; avoid internal links here for now (the panel does not route them
through the site's base path). The current texts are condensed from the
Human Practices page, which is itself transcribed from the write-ups in
`references/`; the full argument stays on the page, this panel is the
digest. Same integrity rules as everywhere: no invented numbers, quotes or
claims.
