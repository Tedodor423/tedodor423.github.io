# The stakeholder record — one file per conversation

Everything the map, the search index and the interviews at the foot of
the human practices page show about a conversation comes from these files. Edit the file, save, done: no code
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
| `order`          | Sort key within a group of the interviews, and for the map's cell assignment. Spaced by 10 so a new conversation can slot in between. |
| `name`, `role`   | As written in the source.                                          |
| `label`          | Only for a group interview: what the write-up heads it with (`Comvita`). Shown as the heading and in the list, with `name` under it. |
| `place`          | Human-readable place, shown on the card.                           |
| `region`         | Country, shown instead of `place` for a withheld interview.        |
| `group`          | `Academics`, `Industry`, `Beekeepers` or `Regulators`, as the write-up groups them. |
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

Five optional sections, these exact headings. The key points are what
the box shows when a reader selects someone on the map, with a link down
to the whole interview at the foot of the page, where all five appear
under the same headings; the quote is shown inside the learn section. A
file with no key points but a bulleted "What we learned" shows those
bullets in the box instead.
A section left empty (other than the key points) is shown with its heading
and nothing under it, so write nothing rather than a placeholder.

```markdown
## Key points

- The write-up's bullet points, one per bullet, **bold** on the phrase
  that matters.

## Why we interviewed

Why we went to this person, where the team has written it down.

## What we learned

Prose, one paragraph per blank-line break, as the 8 October write-up has
it. Bullets (- one point per bullet) also work.

## Quote

> Verbatim, exactly as the team transcribed it.

## How we implemented the advice to change NECTAR

What it changed in NECTAR, where the source states it.
```

A bullet, paragraph or quote may wrap over several lines; a line that does
not start a new bullet continues the previous one.

Inline emphasis is `**bold**` and `*italic*` only, and the two cannot nest:
keep an italic species name outside a bold run (`*S. alvi* **persists**`).
