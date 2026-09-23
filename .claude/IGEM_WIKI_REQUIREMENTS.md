# iGEM 2026 Wiki — requirements and what they mean for this repo

Source: iGEM Competition 2026 → Oxford → Deliverables → Wiki (Getting started,
Requirements, Recommendations, Uploads, HAR Check, Videos & audios, FAQ),
captured 21 Sep 2026. **This file is the contract. When it conflicts with a nice
idea, this file wins.**

| | |
|---|---|
| **Wiki Freeze** | **21 Oct 2026** |
| Published site | `2026.igem.wiki/oxford` |
| Repository | `gitlab.igem.org/2026/oxford` (iGEM GitLab — **force-push is disabled**) |
| Build artifact limit | **5 MB** — exceeding it fails the pipeline with `413 Request Entity Too Large` |
| Uploads (CDN) | `static.igem.wiki` via the Uploads tab — **currently empty** |
| Video | iGEM Video Universe only — moderated, upload at least 2 days before freeze |

---

## 1. Everything loads from iGEM servers (§1)

> "Your wiki must still be readable in 2036."

- **Runtime requests only to `igem.org` and `igem.wiki` domains.** No fetch, XHR,
  web fonts, analytics or AI-API calls anywhere else.
- Source code → the GitLab repo. Images, documents, **fonts** → Uploads /
  `static.igem.wiki`. Video and audio → Video Universe.
- **iframes may only embed iGEM-hosted content.** No YouTube, no Google Drive, no
  third-party dashboards as substantive content.
- **Outbound hyperlinks are fine and encouraged** — DOIs, papers, Zenodo, GitHub
  repos of upstream libraries, other teams' wikis. The rule is about *loaded
  assets and runtime dependencies*, not links.
- Fonts: bundle via a package manager so Vite embeds them, **or** upload the font
  files and reference them from CSS. Never `fonts.googleapis.com`.
- Verify with the **HAR Check** tool before the freeze. Single pages work now; the
  full scan unlocks once the Judging Form is submitted.

## 2. Built from source by CI/CD (§2)

- `.gitlab-ci.yml` must build the site on every push to `main`. It works today —
  don't touch it.
- **Never commit pre-generated output.** No compiled HTML/CSS/JS. A visual design
  tool's export is *output*, not source, and does not satisfy this requirement.
- **Commit the lockfile.** CI runs `yarn install --frozen-lockfile`, so
  `package.json` and `yarn.lock` must always be committed together or the build
  fails.

## 3. Licensing and attribution (§3)

- Team-authored content is **CC-BY-4.0**. The license link must appear in the
  footer; `LICENSE` at the repo root must not be modified or deleted.
- Third-party assets only if licensed for reuse, redistribution **and
  modification** (open source, CC0/CC-BY/CC-BY-SA, public domain).
- **Attribution is mandatory and inline, next to the asset** — source + license.
- No company logos, journal figures, film stills, character art or song lyrics
  without a written license.
- Decorative AI images → release CC-BY-4.0 and **credit the model inline**
  (e.g. "Generated with Stable Diffusion 3").

## 4. Judging pages sit at fixed Standard URLs (§4)

Judges evaluate hundreds of wikis in a short window and navigate by fixed paths.
A criterion documented at an unpredictable URL may simply not be evaluated.

> **GAP — unresolved.** The actual Standard URL list is not yet captured. The
> Requirements page renders it in three collapsed panels (Standard URLs for
> medals / for awards / awards judged without a standard page) that did not come
> through in the text capture. **Get this list before building the route table**
> — the whole `src/pages.ts` skeleton depends on it. Do not guess the paths.

Also required: a **visible footer link to `gitlab.igem.org/2026/oxford`** on every
page.

## 5. Authorship and integrity (§5) — disqualifying territory

- **Citations must resolve and must actually support the claim.** A fabricated,
  garbled or unresolvable citation is a reportable academic-integrity violation.
- **Data figures must be real.** Plots, gels, microscopy, flow cytometry,
  chromatograms, model outputs — no AI generation, modification or "cleaning" of
  anything evidentiary, ever.
- **Quotes must be verbatim.** No invented or AI-generated "representative"
  stakeholder quotes.
- Plagiarism — text, images, designs or code, from teams, literature or a model,
  without attribution — is disqualifying.
- "If you cannot defend a claim, a number, or a figure to a judge, do not put it
  on your wiki."

**Decorative vs evidentiary** is the line that matters. A stylised bacterium or a
hero banner may be AI-generated *with disclosure*; anything presented as evidence
that an experiment happened may not.

## 6. Responsible AI use and disclosure (§6)

Acceptable: polishing wording, grammar, translation, suggesting structure,
drafting alt text, **build and infrastructure code**, decorative illustration.

Not acceptable: **a model authoring the substance** — the reasoning, the project
choices, the descriptions of experiments and human practices work.

Never acceptable: AI-generated scientific claims, data figures, gels, microscopy,
plots, simulated results or citations. *Research misconduct, not a wiki
violation.*

> The test: "did your team write the substance and then ask AI to improve it, or
> did you ask AI to write the substance and then edit what it produced?"

**A required AI-disclosure section must cover:** which models (name + version),
what they were used for, and **how the output was reviewed** — who verified facts,
checked citations, validated code and signed off. One line per use is enough.

## 7. Recommendations — not eligibility rules, but they are the quality bar

- **Write tight.** "A longer sentence is rarely a clearer sentence." Cut.
- **Show what didn't work.** Failed cloning, dead-end models, the experiment that
  taught you something only after it broke.
- **Figures and tables for what prose can't do.** Diagram for a circuit, plot for
  a trend, table for a comparison.
- **Date your milestones.** "Tried X in week 4, switched to Y in week 7."
- **Accessibility:** alt text on informational images, semantic `h1→h2→h3` order,
  readable contrast.
- **Content first, style second.** "Visual flourish on top of incomplete methods
  or hand-wavy results doesn't impress judges — it makes the gaps more visible."
- **Keep the build lean.** Compress images; no massive decorative video.
- **Commit early and often;** branches and Merge Requests for big changes.
- **Test the build the day you activate**, not in the final week.
- **Don't leave the wiki for the final week.** Thousands of teams push at once,
  queues lengthen, and builds that take minutes can take hours.

## 8. Uploads tab specifics

- Files are cached up to **24 h** — replacing a file may keep serving the old one.
- Images are **auto-converted to `.avif`**.
- Organise with sub-folders; for page-specific files use the same path as the page
  URL (e.g. `bee-lab/…`).
- Delete obsolete files.

## 9. Video Universe specifics

- Upload **at least 2 days before the freeze** — every upload is moderator-reviewed
  and is **BLOCKED (not playable, embed included) until approved**. "PUBLIC +
  BLOCKED" together means "correctly configured, awaiting review", not a penalty.
- Required title format (use the generator on the Videos & audios tab), plus a
  description with credits and a wiki link, category, **License: Attribution**,
  language, Privacy: Public, sensitive content: No, publish after transcoding: Yes.
- Captions: review the auto-generated track (it mishears terminology and names),
  upload as a separate **`.vtt`**, one language per file, validate first.
- **Never re-upload.** Duplicates are auto-deleted and you can lose the copy you
  were waiting on. Fix details in place instead.
- Auto-deleted: duplicates, Project Promotion videos (submitted elsewhere),
  non-Public videos, and anything still non-compliant 15 days after upload.

## 10. Stack notes from the FAQ

- iGEM Pages serves **static files only** — no server-side runtime.
- Any framework that builds to static output is fine; the build must be
  reproducible from a fresh clone with **no manual steps**.
- Package managers run in CI — that is the *preferred* way to use libraries,
  because only your build output ships to the visitor.
- **Don't develop the history elsewhere and push it here.** Force-push is disabled
  by design; divergent histories from GitHub have cost teams days. Copy files in
  as normal commits instead.

---

## What this means for this repo, concretely

1. **The 5 MB ceiling is on the build output.** The repo is tiny today (272 KB
   tracked). It stays that way only if images, fonts, PDFs and datasets never get
   committed — hence `references/` and `wiki-assets-source/` are gitignored.
2. **Fonts are a real decision.** CUBAO / Basenji / TBJ Serial Port Mono must be
   bundled or uploaded, and each needs a license permitting embedding and
   redistribution. Unclear license → fall back to the stack default.
3. **`.gitlab-ci.yml` is known-good**: `node:22` → `yarn install --frozen-lockfile`
   → `yarn build` → `dist/` copied to `public/` → `_redirects` SPA fallback. Runs
   on `main` only.
4. **Base path** is `/${slug(VITE_TEAM_NAME)}/`, from `vite.config.ts` plus `.env`.
   Internal links must respect it.
5. **The footer is load-bearing**: CC-BY-4.0 link plus a
   `gitlab.igem.org/2026/oxford` link, on every page. `App.tsx` already carries a
   comment saying so.
6. **Every page needs a human author.** AI assistance here is for structure,
   components, build code, alt text and polish — never for the science. See
   [RESPONSIBLE_AI_USE.md](RESPONSIBLE_AI_USE.md).
