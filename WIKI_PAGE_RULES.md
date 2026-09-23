# How pages work on this wiki

Every page on this wiki is a **Markdown file in `src/content/`**. You do not need
to know React to write, edit or restructure a page. If you can edit a text file in
GitLab's web editor, you can edit this wiki.

Read [.claude/IGEM_WIKI_REQUIREMENTS.md](.claude/IGEM_WIKI_REQUIREMENTS.md) for the
rules iGEM imposes. This file is about how _we_ write.

---

## 1. The mechanics

**One page = one Markdown file.** `src/content/description.md` is the page at
`/description`. Nothing else is needed to make it render.

**The page's title and standfirst live in `src/pages.ts`, not in the Markdown.**
That file is the single route table: it holds the nav label, the `<h1>`, the URL,
the one-line lead, and the menu nesting. Change a title there, not in the `.md`.

Because the `<h1>` comes from the route table, **your Markdown starts at `##`.**
Never put a single `#` heading in a content file — it would produce a second `<h1>`
and break the semantic heading order iGEM asks for.

**Heading order is `##` → `###` → `####`, in order, no skipping.** This is an
accessibility requirement, not a style preference.

### Adding a new page

1. Create `src/content/my-page.md`.
2. Import it and add an entry to `src/pages.ts` — `name`, `title`, `path`,
   `content`, and optionally `lead` and `children`.

That's it. The route, the menu entry and the page all come from that one entry.

### Naming

File names and URLs are **lowercase, hyphen-separated**: `safety-and-security.md`,
not `Safety_And_Security.md`. The file name should match the URL slug.

### Search comes free

There is nothing to register and no index to rebuild. Every page in the route
table is searchable the moment it is added, because the search reads the same
Markdown the page renders (`src/utils/search.ts`).

Four things follow for how you write:

- **Headings are the unit of a result.** A search returns "this page, this
  section", and links to the heading. A page written as one long stretch of
  prose under one heading returns one undifferentiated result; a page with
  real `##` and `###` headings returns the part that answers the question.
- **Your spelling is the dictionary.** A search term that appears nowhere is
  read again: first with the punctuation put back, so "ecoli" finds _E. coli_
  and "loopended" finds loop-ended, then against the words on the wiki within
  a typo or two, so "yest" finds yeast and "modeling" finds modelling. It can only ever correct towards
  words we have actually written, which means a term spelled two ways across
  two pages is findable under both, and a term misspelled everywhere is
  findable only by the misspelling.
- **The stakeholder profiles are searched too**, by name, role, place, quote
  and what we learnt, and a result links to the profile itself. The four
  interviews carrying `consent` in `src/data/stakeholders.ts` are left out of
  the index entirely, so they cannot be found by typing the name the page is
  withholding. Delete a `consent` field when the review lands and that profile
  renders and becomes searchable in the same move; add one and it disappears
  from both.
- **Placeholders are searchable too.** `> **TODO —** ...` blocks show up in
  results like any other text. That is deliberate: it is the same honesty as
  showing them on the page. It is also a second reason to delete them as they
  are filled.

---

## 2. What may and may not go in a page

**Plain Markdown, plus GitHub-flavoured tables.** Headings, paragraphs, lists,
tables, links, blockquotes, code blocks, bold, italic.

**No raw HTML, no inline styles, no scripts.** If a page seems to need one, it
needs a component instead — raise it rather than working around it.

**Placing a component in a page.** A fenced block whose language is
`component` is a slot, and the block's text names the component:

````markdown
```component
stakeholder-map
```
````

The names that exist are listed in `SLOTS` in `src/components/MarkdownPage.tsx`;
a name that is not there renders as an ordinary code block, so a typo is visible
on the page rather than silently blank. Any content a component shows must also
be reachable as text on the page — the stakeholder map, for instance, renders its
full record underneath itself. Nothing may exist only behind a hover.

**Images are not in the repo.** Every image is uploaded to `static.igem.wiki` via
[the uploads tool](https://teams.igem.org/go/deliverables/wiki/uploads) and
referenced by its CDN URL:

```markdown
![Gel showing intact dsRNA recovered from larval haemolymph at 24 h](https://static.igem.wiki/teams/XXXX/…)
```

**Alt text is mandatory on every informational image.** Describe what the image
shows, not what it is. "Agarose gel with three lanes" is useless; "Intact 700 bp
dsRNA recovered from larval haemolymph 24 h after dosing, with undosed and water
controls" is the caption a judge needs.

**Every third-party or AI-generated image needs a credit line directly beneath it**
giving source and licence. This is an iGEM requirement, not a courtesy.

### Linking to another page on this wiki

Write internal links starting with a slash, exactly as the path appears in
`src/pages.ts`:

```markdown
See [the bee lab](/bee-lab) and [Australia](/case-studies/australia).
```

`MarkdownPage` turns those into router links, so they pick up the `/oxford/`
base path and navigate without reloading the page. Do **not** write the base
path yourself (`/oxford/bee-lab` is wrong) and do not use relative paths —
they break on nested URLs. External links are ordinary Markdown links and open
in a new tab automatically.

---

## 3. What a page has to prove

Judges skim. Every substantive page answers five questions near the top, before
anything else:

1. What problem or question were we addressing?
2. What did we do?
3. What did we find?
4. What did that change?
5. Where is the evidence?

If a page cannot answer those five in its first screen, it is not finished,
however long it is.

### Write tight

iGEM's own guidance, and ours: _"A longer sentence is rarely a clearer sentence; a
longer section is rarely a more convincing one."_ The team's note on this is
blunter — **the less text the better.** When a section is done, ask whether it can
be shorter and still say the same thing. If yes, cut it.

The danger on this project is not too little detail. It is burying the argument
under the detail.

### Show what didn't work

Failed cloning, dead-end models, the assay that only made sense after it broke.
This is explicitly rewarded, it is more useful to the next team, and on this
project several of the strongest results _are_ negatives — the extraction-method
null, the toehold rejection, the Mango correction.

### Date things

"We tried X in week 4 and switched to Y in week 7" is worth more than an undated
list. Dates belong on notebook entries, contributions, engineering cycles and
human-practices dialogues.

---

## 4. House conventions

These come from the team's own wiki plan. Use them consistently — a judge who
learns to read one page should be able to read all of them.

### Status labels

Put one on every claim, cycle and model:

| Label            | Means                                        |
| ---------------- | -------------------------------------------- |
| **Demonstrated** | We did it and we have the data               |
| **Investigated** | We ran it; the result is partial or negative |
| **Modelled**     | Computational only, no bench data            |
| **Proposed**     | Designed, not built                          |

### Citation tags

| Tag      | Means                                                                      |
| -------- | -------------------------------------------------------------------------- |
| `[LIT]`  | From a source we retrieved and read                                        |
| `[CALC]` | Our own arithmetic from `[LIT]` inputs, assumptions stated inline          |
| `[FLAG]` | Literature is silent, or we could not verify it — **never stated as fact** |

### Engineering cycles — always the same seven beats

Question → Design → Build → Test → Result → What we learnt → What it changed.

Identical shape every time, so a judge learns it once and can read sixteen.

### Headline results — always the same eight fields

Question · Experiment · Evidence · Controls + n · Result · Interpretation ·
Limitation · What it changed.

Do this for failed experiments too.

### Models

Every model carries a visible **"How did this change NECTAR?"** box. If the honest
answer is "it didn't", the model probably doesn't deserve the space.

---

## 5. The integrity rules — read these before writing a word

These are not style guidance. Breaking them is research misconduct and can
disqualify the team.

- **Never invent a number, a result, a figure, a quote or a citation.** If we do
  not have it yet, it goes in as a TODO (below), not as plausible-sounding prose.
- **Every citation must resolve** to a real DOI, part number, arXiv ID, ISBN or
  stable URL, **and the cited claim must actually appear in that source.**
- **Evidentiary figures must be our real data** — gels, qPCR, microscopy, plots,
  model outputs. No AI generation, modification or "cleaning up", ever.
- **Quotes must be verbatim.** No reconstructed or representative quotes.
- **Check consent before publishing a named stakeholder.** At least two of our
  interviewees have outstanding conditions — see `references/INDEX.md`.
- If you cannot defend a claim, a number or a figure to a judge, it does not go on
  the wiki.

### The TODO convention

Where we don't have something yet, say so in the page, visibly:

```markdown
> **TODO —** Mite mortality titre: numbers not in yet. Owner: bee lab. Blocked on
> the Round 2 screen.
```

A visible TODO is honest and costs nothing. Invented filler is misconduct. Never
choose the second to avoid the first.

### Placeholder blocks

The skeletons use five block types, all written as blockquotes so they stand out
in the rendered page and are trivial to grep for:

| Block                                          | For                                                            |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `> **TODO —**`                                 | Something missing, with an owner and a blocker                 |
| `> **FIGURE —**`                               | Where an image goes, and what it must show                     |
| `> **TABLE —**`                                | Where a table goes, and what its columns are                   |
| `> **PDF —**`                                  | A document to upload to `static.igem.wiki` and link            |
| `> **RESULT BLOCK —**` / `> **CYCLE BLOCK —**` | Where the eight-field result or seven-beat cycle shape repeats |

Describe what the figure has to _show_, not that a figure goes there. "Gel
image" tells the person writing the page nothing; the description is half the
work of making the figure.

Delete a placeholder when you replace it. A page is finished when it has none
left — and `grep -rn "TODO —" src/content/` is the fastest read on where the
wiki actually stands.

---

## 6. Depth: one URL, three layers

Two readers have to be served by the same page. A judge, who needs the argument in
90 seconds. A future iGEM team, who wants every protocol and dead end.

- **Layer 1 — always visible.** Plain language, short sentences, one strong figure.
  A newcomer gets the point without clicking anything.
- **Layer 2 — the detail.** How exactly; methods summaries, nuance, extra figures.
- **Layer 3 — the exhaustive record.** Full protocols, full interview write-ups,
  parameter tables, failed attempts.

Right now, with no components built, layers are just **document structure** —
Layer 1 at the top of the page, Layer 3 further down or on a linked page. Later,
Layer 2 and 3 can collapse into expandable panels. Write the layers now and the
components will slot in without a rewrite.

**Never hide a conclusion, a result or a citation inside a collapsed layer.** A
skimming judge must not be able to miss evidence.

---

## 7. Current state

Every page in `src/content/` is a **skeleton**: section structure, a note on
what each section has to do, and placeholder blocks where the evidence goes.
None of them contains a result, a number, a quote or a citation, and each opens
with a line saying so. They exist so that:

- every URL resolves from day one and the CI pipeline is proven early,
- the argument of each page is agreed before anyone writes prose into it, and
- content can be written page by page without anyone waiting on the scaffolding.

Writing a page means replacing the guidance text with the real thing and
deleting the placeholders as you satisfy them. Remove the skeleton line at the
top when the page no longer needs it.

Styling is deliberately minimal — project colours and readable type, nothing else.
Per iGEM's own recommendation: get the content right first, then style it.
_"Visual flourish on top of incomplete methods or hand-wavy results doesn't impress
judges — it makes the gaps more visible."_

When styling does start, the rules for it are in
[.claude/skills/anti-vibecoded-design/SKILL.md](.claude/skills/anti-vibecoded-design/SKILL.md)
— the visual and verbal defaults that make a page read as machine-generated, and
what to do instead. It covers copy as well as CSS, so it applies to writing a page,
not only to styling one.
