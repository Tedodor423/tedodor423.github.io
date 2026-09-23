---
name: anti-vibecoded-design
description: Rules for building websites that do not look AI-generated ("vibecoded"). Use this skill whenever building, styling, reviewing or rewriting any page, layout, stylesheet or UI component of this wiki, and whenever writing wiki copy, even if the user does not mention "AI look" explicitly.
---

# Anti-Vibecoded Design

## TL;DR
AI-generated sites converge on the same defaults: Inter font, purple gradients,
glassy cards in rows of three, emoji and sparkle icons, soft pastel palettes and
"it's not X, it's Y" copy. Judges and users now recognise these on sight, and they
signal "no one made decisions here". Every visual and verbal choice below should be
deliberate and tied to the content, not the model's default.

## The 30 tells, and what to do instead

### Colour and surface
| # | Avoid | Why it reads as AI | Do instead |
|---|-------|--------------------|------------|
| 1 | Harsh gradients | Default hero treatment in generated templates | Flat colour, or a subtle gradient with a real purpose (e.g. data scale) |
| 3 | Pure white `#FFFFFF` background | Untouched default | Off-white or tinted neutral drawn from the brand palette |
| 4 | Rainbow colouring (e.g. multicolour words) | Decoration without meaning | One accent colour; colour only where it encodes something |
| 20 | Purple and black | The single most common AI palette | Palette derived from the subject (for NECTAR: honey, wax, hive tones) |
| 29 | Neon colours | Generic "tech" look | Muted, saturated-but-natural tones |
| 30 | Basic pastel colours | Default "calm/soft" card palette | A small, named palette with defined roles (bg, text, accent, warning) |
| 5 | Drop shadows everywhere | Default card elevation | Borders, spacing or background contrast to separate elements |
| 8 | Liquid glass / glassmorphism | Trend-chasing default | Solid surfaces |
| 22 | Radial orbs (blurred colour blobs) | Filler background decoration | Real imagery: lab photos, micrographs, diagrams |
| 23 | Dot grids | Filler texture | Plain background, or a texture that relates to content (e.g. honeycomb, used sparingly) |

### Layout and components
| # | Avoid | Why | Do instead |
|---|-------|-----|------------|
| 6 | 3 feature cards in a row | Template default | Layout driven by content; vary section structure |
| 13 | Bento grids | Overused showcase pattern | Editorial layouts: text + figure, full-width figures |
| 14 | Fake terminal windows | Decoration pretending to be technical | Show real code/output only when it is actual content |
| 11 | Coloured left stripe on cards/callouts | Default "highlight" style | Headings, whitespace, or a clearly designed callout style used consistently |
| 19 | Soft uniform corner radius on everything | Unconsidered default | Pick a radius system (can be 0) and apply it deliberately |
| 17 | 3 pricing tiers | SaaS template leftover | Omit unless genuinely selling tiers |

### Icons and decoration
| # | Avoid | Why | Do instead |
|---|-------|-----|------------|
| 2 | Lucide icons | Default library in generated code | Custom or project-drawn icons, or no icons |
| 7 | Emojis | Instant AI tell in headings/bullets | Plain text, or custom illustration |
| 16 | Checkmark bullets | Template feature-list style | Normal bullets or prose |
| 24 | Sparkle icons ✦ | Now synonymous with "AI" | Remove |
| 25 | Animated arrows | Gimmicky CTA decoration | Static, clear links/buttons |
| 28 | Hover animations on everything | Motion without purpose | Motion only where it aids understanding (e.g. stepping through a figure) |

### Typography and copy
| # | Avoid | Why | Do instead |
|---|-------|-----|------------|
| 10 | Inter / Geist / Space Grotesk | The three default AI fonts | A characterful pairing (e.g. a serif for headings + readable sans for body), chosen for the project |
| 9 | Em dashes | Overused by LLMs in copy | Commas, full stops, colons, brackets |
| 15 | "It's not X, it's Y" | Classic LLM sentence template | State what it is directly |
| 12 | Fake testimonials | Fabricated social proof | Real quotes from stakeholders (named, with permission) or nothing |

### Substance and completeness
| # | Avoid | Why | Do instead |
|---|-------|-----|------------|
| 18 | No real product demos | Claims without evidence | Real data, gel images, plots, photos, videos |
| 21 | No skeleton loaders | Content pops in; unpolished | Skeletons or fixed-size placeholders for anything loaded async |
| 26 | No Terms of Service | Signals a throwaway site | Include where relevant |
| 27 | No privacy policy | Same | Include where relevant |

## Workflow
1. Before writing any CSS, define: palette (roles + hex), 2 fonts, radius, spacing
   scale, icon approach. Justify each from the content.
2. Build.
3. Audit the output against all 30 items above. Grep copy for `—`, "not just",
   "it's not", emoji ranges, and "✨/✦".
4. Replace any hit with the "Do instead" option, not a near variant (a blue glass
   card is still a glass card).

## iGEM wiki notes
- Items 17, 26, 27 mostly do not apply to an iGEM wiki; skip unless the page
  genuinely needs them.
- Item 12: Human Practices quotes must be real and attributable; this is also a
  judging issue, not just aesthetics. See the integrity rules in
  [WIKI_PAGE_RULES.md](../../../WIKI_PAGE_RULES.md) §5.
- Item 18 matters most for judges: show real results (plots, gels, photos) rather
  than decorative graphics.
- Fonts must be served from iGEM infrastructure, never a font CDN
  ([.claude/IGEM_WIKI_REQUIREMENTS.md](../../IGEM_WIKI_REQUIREMENTS.md) §1). Already
  satisfied: the three brand faces are uploaded to `static.igem.wiki` and declared
  in [src/styles/brand.css](../../../src/styles/brand.css). Any new face goes
  through the uploads tool the same way, with a licence that permits web embedding.

## Where this repo stands

Step 1 of the workflow is already done and lives in
[src/styles/brand.css](../../../src/styles/brand.css): palette, type stack and the
roles each token plays, taken from the team brand kit. Extend that file rather than
inventing tokens per page or per component.

Four known tensions, all open decisions rather than settled ones. Do not silently
"fix" them; raise them.

- **Item 3, pure white background.** `--surface` is `#ffffff`. The tinted
  `--surface-muted` (`#fbf7ec`) exists and could take over as the page surface.
- **Item 11, coloured left stripe.** `.markdown-page blockquote` uses a 5px honey
  left border, and blockquotes are how every TODO / FIGURE / RESULT placeholder is
  written. If the stripe goes, those blocks need another consistent treatment.
- **Item 9, em dashes.** About 300 of them across `src/content/`, plus the house
  docs. It is currently the team's voice, and the brand's mono face cannot draw the
  glyph at all (see the TBJ note in `brand.css`). Changing it is a voice decision
  for the team, not a find-and-replace.
- **Item 7, emoji.** Five content files use coloured-circle emoji as an evidence
  key: green supported, yellow preliminary, red failed, blue modelled
  (`src/content/results.md` defines it; ecological-modelling, entrepreneurship,
  model and yeast use it). The colour does encode something, so item 4 is clear,
  but emoji as a status glyph is item 7 and it duplicates the written status
  labels already specified in `WIKI_PAGE_RULES.md` §4. One key, rendered as a
  designed label, would satisfy both.

These rules are not left to judgement. A `PreToolUse` hook
([.claude/hooks/design-guard.mjs](../../hooks/design-guard.mjs), wired up in
[.claude/settings.json](../../settings.json)) fires on every Write or Edit to a
file under `src/` ending `.css`, `.tsx`, `.ts` or `.md`, and to `index.html`. It
injects this file on the first such edit of a session, a short pointer after that,
and it scans the proposed text for the tells it can match mechanically: gradients,
non-inset drop shadows, glassmorphism, Lucide, the three default fonts, emoji and
sparkle glyphs, and "it's not X, it's Y". It reports rather than blocks, because
four of the thirty items above are open decisions here and a regex cannot tell a
decision from a mistake. Set `BLOCK = true` at the top of the script to make a hit
raise a permission prompt instead.

Item 20 (purple and black) reads as a hit but is not one: `--violet #6b2895` and
`--ink #000000` come from the team's own brand kit, alongside honey and Oxford navy.
Keep the justification visible so a reviewer does not "correct" it.
