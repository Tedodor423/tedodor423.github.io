# The HIVE questions — one file per question

`q1.md` … `q7.md` drive the map's question list and the pane that opens
when a question is selected. Edit a file, save, done: no code changes —
except adding a question, which also needs its id in `QUESTION_IDS` in
`src/data/stakeholders.ts`.

## Frontmatter

- `title` — the question's name, as the team's write-up heads it.
- One line per HIVE stage that has people: `hear`, `investigate`,
  `verdict`, `evaluate`. Each is a comma-separated list of conversation
  ids (the filenames in `../stakeholders/`). The map draws the question's
  loop through these people in stage order.
- The team's HIVE definition puts every stakeholder conversation in Hear
  ("what stakeholders told us, in their words, attributed and dated";
  anything we read, measured or modelled is Investigate), so in practice
  only `hear` carries people.
- A `*` after an id marks a conversation as central to this question: only
  those wear the stage letter badge on the map.
- A conversation tagged to this question (in its own file's `questions` /
  `anchors` / `provisional`) but listed in no stage here defaults to Hear.

## Body

`## Summary` first: the question's introduction, shown at the top of the
pane a step larger than the rest. Then one section per stage, these exact
headings: `## Hear`, `## Investigate`, `## Verdict`, `## Evaluate`.
Hovering a stage that has people picks them out on the map. A stage with
neither text nor people is skipped. The pane scrolls, so length is not
capped.

The text is transcribed from the team's 8 October write-up
(`references/updates/hp-writeup-10-08.md`), with important passages bolded.
Plain Markdown; external links are fine, avoid internal links here (the
pane does not route them through the site's base path). Same integrity
rules as everywhere: no invented numbers, quotes or claims.
