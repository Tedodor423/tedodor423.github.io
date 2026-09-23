# Notes for AI assistants

Read **[README.md](README.md)** first — it covers the stack, where to edit
(`src/contents/*`, `src/pages.ts`), the `yarn` commands, and the iGEM asset rules
(images via the uploads tool, videos from iGEM servers, no external CDNs).

## Responsible & honest use
@.claude/RESPONSIBLE_AI_USE.md

## The iGEM contract
@.claude/IGEM_WIKI_REQUIREMENTS.md

## How pages work
Every page is a Markdown file in `src/content/`, mapped to a URL in
`src/pages.ts`. Authoring rules, house conventions and the integrity rules are in
**[WIKI_PAGE_RULES.md](WIKI_PAGE_RULES.md)** — read it before writing or editing
any page.

## How pages look
Design decisions for this wiki — palette, type, layout, and the AI-default
patterns to stay away from — are in the `anti-vibecoded-design` skill at
[.claude/skills/anti-vibecoded-design/SKILL.md](.claude/skills/anti-vibecoded-design/SKILL.md).
Read it before writing CSS, adding a component or restyling a page. The brand
tokens it refers to live in `src/styles/brand.css`.

Loading that skill is not left to chance: a `PreToolUse` hook in
`.claude/settings.json` runs `.claude/hooks/design-guard.mjs` on every edit to a
file under `src/` (`.css`, `.tsx`, `.ts`, `.md`) and to `index.html`. It puts the
rules in context before the edit and flags the mechanically detectable tells in the
proposed text. It reports, it does not block. Turn it off for a session with
`/hooks`, or permanently by deleting the `hooks` block.

## Guardrails
- Don't change `LICENSE` or the `Footer` component's license notice + GitLab
  repository link (both required on every page for judging).
- `.gitlab-ci.yml` works as-is; change it only if you know what you're doing —
  any build/deploy issues that result are the team's responsibility.
- **Wiki Freeze: 21 Oct 2026.** Build output must stay under **5 MB** — no images,
  fonts, PDFs or datasets in the repo; they go to `static.igem.wiki` via the
  uploads tool.
- `package.json` and `yarn.lock` are committed together, always — CI runs
  `yarn install --frozen-lockfile` and fails if they drift.

## Working practice
- Build the wiki **one page at a time**, from agreed principles and a skeleton.
  A previous whole-wiki single-prompt attempt failed and was reverted; it is
  parked on the `archive/ai-rebuild-2026-09-21` branch.
- Team source material (lab journals, the wiki plan, DBTL cycles, interviews)
  lives in the gitignored `references/` folder — see `references/INDEX.md` for
  what is in it and which page each source feeds.
- Every scientific claim, number, figure and citation must trace to something in
  `references/` or to a real published source. Anything else is a clearly
  labelled TODO, never an invention.