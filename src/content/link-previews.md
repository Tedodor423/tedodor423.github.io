# Link previews

What the card says when a reader rests the pointer on a link to a page of
this wiki, or tabs to it. One entry per page, in the order of
`src/pages.ts`. Edit an entry, save, and the card changes: no code to touch.

Every entry has the same shape:

```markdown
## Case Study: Australia (/case-studies/australia)

Recent establishment, reinvasion pressure and an industry under strain.

![](https://static.igem.wiki/teams/6391/wiki/previews/australia.avif)
Credit: Photo by A. Person, CC BY 4.0

---
```

- **The heading is the card's title.** Reword it freely. The path in
  brackets says which page the entry belongs to, written exactly as in
  `src/pages.ts`: change it only when the page moves. Leave the words out,
  `## (/case-studies/australia)`, and the card uses the page's own title.
- **The summary is everything under the heading** that is not an image or a
  credit: one or two sentences, plain text, with `*italic*` and `**bold**`.
  Leave it empty and the card says "No summary yet."
- **The image is optional:** one `![](…)` line, shown beside the summary in a
  column 8rem wide, cropped to fill the card's height, so a square or upright
  picture crops best. It has to come from `static.igem.wiki` through the
  uploads tool, like every image on the wiki. No line, no image.
- **An image that is not the team's own needs a `Credit:` line** directly
  under it, with source and licence. The card prints it under the summary:
  iGEM requires the credit next to the image wherever it appears.
- **`---` between entries** keeps the file readable. The headings are what
  separate the entries, so a missing or extra `---` breaks nothing.

A summary restates its page and never adds to it: nothing may exist only
behind a hover. The integrity rules of `WIKI_PAGE_RULES.md` §5 hold here as
on any page. A page with no entry gets "No summary yet". While `yarn dev`
runs, the browser console names any heading whose path matches no page.

---

## NECTAR (/)

Oxford iGEM 2026.

---

## Project Description (/project-description)

The problem, the idea, and what we set out to build.

---

## Engineering (/engineering)

---

## Results (/results)

What we found, and how strongly the evidence supports it.

---

## Contribution (/contribution)

What we leave behind for the teams that come after us.

---

## Measurement (/measurement)

Quantifying dsRNA in bee material, and the methods we had to build to do it.

---

## Designing Our dsRNA Construct (/software)

NectarDesigner: how we choose the sequence that silences the mite.

---

## Wet Lab Experiments and Protocols (/wet-lab-experiments)

Protocols in enough detail for another team to repeat them, and why yeast is the chassis.

---

## Wet Lab Lab Book (/wet-lab-labbook)

The dated record of the wet lab.

---

## Bee Lab (/bee-lab)

Working with live bees: delivery, dosing and the assays we had to invent.

---

## Bee Lab Experiments and Protocols (/bee-lab-experiments)

The bee-lab methods, written to be followed.

---

## Safety and Security (/project-safety)

Risks of our system, and what we did about each of them.

---

## Hardware (/hardware)

The hive insert and the equipment we built around it.

---

## NECTAR User Manual (/user-manual)

How a beekeeper would actually use this.

---

## How to Work with Bees as an iGEM Team (/working-with-bees)

What we wish another team had told us before our first hive.

---

## Bee Lab Lab Book (/bee-lab-labbook)

The dated record of the bee lab, 29 June to 25 September 2026.

---

## NECTAR in the Real World (/human-practices)

---

## Public Outreach (/education)

What we taught, to whom, and what we learned back.

---

## Sustainable Development (/sustainability)

Which SDGs we affect, including where we affect them negatively.

---

## Team (/team)

The people behind NECTAR.

---

## Team Members (/team/members)

Who we are.

---

## Attributions (/attributions)

Who did what, and what help we received.

---

## Fundraising and Partners (/partners)

Who supported this project, and how.

---

## Timeline (/timeline)

Eight months, five workstreams running at once, and the dates each one turned.

---

## Case Studies (/case-studies)

The same technology meets very different realities.

---

## Case Study: Australia (/case-studies/australia)

Recent establishment, reinvasion pressure and an industry under strain.

---

## Case Study: California (/case-studies/california)

Migratory beekeeping at enormous scale, and the almond pollination market.

---

## Economic Modelling (/economic-modelling)

Allowable cost, manufacturing cost, and the yeast titre they imply.

---

## NECTAR for the Future (/future)

Where this goes after iGEM.

---

## Dry Lab and Modelling (/model)

The models, their assumptions, and the decisions they changed.

---

## Ecological Modelling (/ecological-modelling)

Colony and Varroa dynamics, and what treatment efficacy has to reach.

---

## Entrepreneurship (/entrepreneurship)

The product, the user, the cost, and the route to market.
