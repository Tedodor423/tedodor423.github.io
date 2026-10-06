# The stakeholder record — one file per conversation

Everything the map, the search index and the roster show about a
conversation comes from these files. Edit the file, save, done: no code
changes. The filename (without `.md`) is the conversation's id, which the
question files in `../questions/` refer to.

## The rules that are not style

- **Everything here is transcribed from the team's own write-ups** in
  `references/`. Nothing is generated, summarised from outside those
  documents, or inferred. If we do not have it, the file does not say it.
- **Quotes are verbatim** as the team transcribed them, bracketed
  insertions and ellipses included. A quote that is not in the source word
  for word does not go in a file.
- **Consent.** A file with `consent-status` renders as a withheld entry: no
  name, role, content or photo appears on the page, and the profile is left
  out of the search index. Keep the body of such a file empty — this is a
  public repository, so text that may not be published does not belong here
  even unrendered. When consent lands, delete `consent-status` and
  `consent-note` and fill in the sections.
- **Photos.** `photo` names a file in `wiki-assets-source/stakeholder-photos/`
  (see the README there for the upload steps). Never add a `photo` line to
  a withheld entry: a face identifies a person as surely as a name.

## Frontmatter fields

| Field            | Meaning                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `order`          | Sort key for the roster and the map's cell assignment. Spaced by 10 so a new conversation can slot in between. |
| `name`, `role`   | As written in the source.                                          |
| `place`          | Human-readable place, shown on the card.                           |
| `region`         | Country grouping for the roster.                                   |
| `lat`, `lon`     | A plotting position, not a claim about where a person was sitting. |
| `hex`            | Only if the nearest map cell picks the wrong landmass: `col, row`. |
| `photo`          | Basename of the photograph, no extension.                          |
| `photo-shows`    | Who the photo actually shows, if not simply `name`.                |
| `date`           | Interview date. Omit if the source records none.                   |
| `questions`      | Questions where the team's table lists this as supporting: `Q1, Q3`. |
| `anchors`        | Questions where the table names this as the anchor interview.      |
| `provisional`    | Tags the table does not state, inferred from the profile. Render dashed so a reader can tell. |
| `consent-status` | `review-pending` or `not-given`. See Consent above.                |
| `consent-note`   | The note shown in place of the profile.                            |

## Body sections

Four optional sections, these exact headings. Why, learn and impact are
the three sections of the box that opens when a reader selects someone on
the map, under the same headings; the quote is shown inside the learn
section.
A section left empty is shown with its heading and nothing under it, so
write nothing rather than a placeholder.

```markdown
## Why did we choose this stakeholder

Why we went to this person, where the team has written it down.

## What did we learn from them

- One point per bullet, transcribed.

## Quote

> Verbatim, exactly as the team transcribed it.

## How did this impact the project

What it changed in NECTAR, where the source states it.
```

A bullet or quote may wrap over several lines; a line that does not start a
new bullet continues the previous one.
