/* The team page: one card per member, read by TeamGallery and by the search.
 *
 * Every word here is the team's own, from the "Meet the iGEM 2026 Team"
 * Instagram series (references/Meet the iGEM 2026 Team.pptx): the first name
 * the post leads with, the workstreams under it, year, course and college,
 * and the one line of trivia each post carries, kept as written, emoji and
 * all. College nicknames are written out (St Catz, Univ) so a reader outside
 * Oxford can place them; nothing else is reworded.
 *
 * The two PIs carry "PI" where the students carry their workstreams, and in
 * place of year and college their name and title as the jamboree deck
 * credits them (references/jamboree-presentation.md, slide 20) with their
 * department (the project timeline and the write-up). Geraldine Wright had no
 * post: her photograph came on its own and was cut out to match (see
 * wiki-assets-source/images_dev/team-src/), and her card has no trivia.
 *
 * Images are not in the repo. The cut-outs were taken from the same deck and
 * normalised so every face sits at one size and height in its frame; the
 * sources are in the gitignored wiki-assets-source/images_dev/team/, which the
 * dev server answers at <base>/images-dev/team/ (the images-dev plugin in
 * vite.config.ts), and the upload-ready copies are in team-upload/ next to it.
 * The published site loads them from static.igem.wiki under assets/team/.
 * Each member has two: <id>.avif, the photograph with its white sticker edge,
 * and <id>-echo.avif, the honey duotone the posts set behind it.
 *
 * TEMPORARY FALLBACK, as for the crop drawings on the home deck. Until the
 * upload is done, a published build that cannot load the static.igem.wiki
 * URLs tries copies in the gitignored public/local/team/, which CI builds
 * without; past that, the cards show without their photographs. One probe
 * decides for every card. Once the static.igem.wiki URLs answer, drop
 * LOCAL_ART and the probe.
 */

import { useEffect, useState } from "react";

export interface Fact {
  /** The post's question or label ("Hidden talent"). Omitted when the line
   * stands on its own. */
  prompt?: string;
  answer: string;
}

export interface Member {
  /** Basename of the two images, and the card's anchor after "member-". */
  id: string;
  name: string;
  /** Workstreams, in the post's order. */
  roles: string[];
  /** Omitted for the PIs. */
  study?: { year: string; course: string; college: string };
  /** For a member with no year or college (the PIs): name with title, and
   * department, for the label in their place. */
  credit?: string[];
  facts: Fact[];
  /** What the photograph shows, for its alt text. */
  alt: string;
}

/* In the order the team chose for the page. */
export const MEMBERS: Member[] = [
  {
    id: "anree",
    name: "Anree",
    roles: ["Wet Lab", "Bee Lab", "R&D"],
    study: { year: "2nd year", course: "Biology", college: "St Catherine's" },
    facts: [{ prompt: "Fun fact", answer: "Opened for Boney M at John's Ball" }],
    alt: "Anree smiling, in a lab coat and safety glasses.",
  },
  {
    id: "theodor",
    name: "Theodor",
    roles: ["Wet Lab", "Bee Lab", "Dry Lab", "Fundraising"],
    study: {
      year: "1st year",
      course: "Biomedical Science",
      college: "Lady Margaret Hall",
    },
    facts: [
      { prompt: "Fav snack for long lab days", answer: "MILK" },
      { prompt: "Number of tabs open", answer: "274" },
    ],
    alt: "Theodor in a beekeeping suit, hands on hips.",
  },
  {
    id: "freddie",
    name: "Freddie",
    roles: ["Wet Lab", "Bee Lab", "R&D"],
    study: { year: "1st year", course: "Biology", college: "Queen's" },
    facts: [
      {
        prompt: "Fav pipette size",
        answer: "p1000 - most accurate for my motor skills",
      },
    ],
    alt: "Freddie smiling, in a navy jumper.",
  },
  {
    id: "hafez",
    name: "Hafez",
    roles: ["Team Mentor", "PI"],
    credit: ["Dr. Hafez El-Sayyed", "Biochemistry"],
    facts: [{ answer: "Is only protecting the bees to keep the honey flowing" }],
    alt: "Hafez smiling, arms crossed.",
  },
  {
    id: "geraldine",
    name: "Geraldine",
    roles: ["PI"],
    credit: ["Prof. Geraldine Wright", "Biology"],
    facts: [],
    alt: "Geraldine smiling, in a grey-blue cardigan over a black top.",
  },
  {
    id: "michael",
    name: "Michael",
    roles: ["Wet Lab", "Bee Lab"],
    study: { year: "2nd year", course: "Biomedical Science", college: "Queen's" },
    facts: [
      {
        prompt: "If you were a bee what bee would you be?",
        answer: "Worker bee cause I’m married to the grind💵",
      },
    ],
    alt: "Michael in a lab coat, holding up both gloved hands.",
  },
  {
    id: "diogo",
    name: "Diogo",
    roles: ["Wet Lab", "Bee Lab", "Human Practices"],
    study: { year: "2nd year", course: "Biology", college: "Hertford" },
    facts: [{ prompt: "Hidden talent", answer: "Can (almost) juggle" }],
    alt: "Diogo smiling, arms crossed, in a beekeeping suit.",
  },
  {
    id: "sammi",
    name: "Sammi",
    roles: ["Wet Lab", "Bee Lab", "Human Practices", "PR"],
    study: { year: "2nd year", course: "Biology", college: "St Catherine's" },
    facts: [
      {
        prompt: "Fun fact",
        answer: "has been to the northernmost town in the world",
      },
    ],
    alt: "Sammi in a lab coat, holding a pipette.",
  },
  {
    id: "roman",
    name: "Roman",
    roles: ["Wet Lab", "Bee Lab", "Fundraising"],
    study: { year: "1st year", course: "Biology", college: "Lady Margaret Hall" },
    facts: [{ prompt: "Fav tv show", answer: "breaking bad" }],
    alt: "Roman in a scarf, looking straight at the camera.",
  },
  {
    id: "lisa-st-johns",
    name: "Lisa",
    roles: ["Wet Lab", "Bee Lab"],
    study: { year: "1st year", course: "Biochemistry", college: "St John's" },
    facts: [{ answer: "Still eats safari animals" }],
    alt: "Lisa in a lab coat, gloves and safety glasses, holding up a sample tube.",
  },
  {
    id: "patrick",
    name: "Patrick",
    roles: ["Wet Lab", "Dry Lab"],
    study: { year: "2nd year", course: "Biology", college: "Pembroke" },
    facts: [{ prompt: "Hidden talent", answer: "geometry dash" }],
    alt: "Patrick in a lab coat and safety glasses, holding a laptop and raising one finger.",
  },
  {
    id: "anna",
    name: "Anna",
    roles: ["Wet Lab", "Bee Lab", "Human Practices"],
    study: { year: "1st year", course: "Biomedical Science", college: "New College" },
    facts: [
      {
        prompt: "Fav bee pun",
        answer: "What do you call an indecisive bee? a maybee",
      },
    ],
    alt: "Anna smiling, in a floral top.",
  },
  {
    id: "ariana",
    name: "Ariana",
    roles: ["Wet Lab", "Bee Lab", "PR"],
    study: { year: "1st year", course: "Biochemistry", college: "St Hilda's" },
    facts: [
      {
        prompt: "Fun fact",
        answer: "Has competed in both water polo and ice skating",
      },
    ],
    alt: "Ariana in a lab coat, gloves and orange safety goggles, pointing a pipette at the camera.",
  },
  {
    id: "ella",
    name: "Ella",
    roles: ["Human Practices"],
    study: { year: "2nd year", course: "Biology", college: "Brasenose" },
    facts: [
      {
        prompt: "Hidden talent",
        answer: "capoeira and zumba (she started this month)",
      },
    ],
    alt: "Ella smiling, sunglasses pushed up, in a navy T-shirt.",
  },
  {
    id: "ellie",
    name: "Ellie",
    roles: ["Human Practices"],
    study: { year: "1st year", course: "Biochemistry", college: "Somerville" },
    facts: [
      {
        prompt: "Fav scientist",
        answer: "Dorothy Hodgkin because she went to Somerville 💪💪",
      },
    ],
    alt: "Ellie smiling, hands on hips.",
  },
  {
    id: "gracie",
    name: "Gracie",
    roles: ["Dry Lab", "Human Practices"],
    study: { year: "2nd year", course: "Biochemistry", college: "St Anne's" },
    facts: [
      {
        prompt: "Hidden talent",
        answer: "Jumping across my 2 arms held together",
      },
    ],
    alt: "Gracie in a lab coat, glancing back at the camera.",
  },
  {
    id: "laura",
    name: "Laura",
    roles: ["Human Practices"],
    study: { year: "3rd year", course: "Chemistry", college: "St Anne's" },
    facts: [
      {
        prompt: "Fav piece of lab equipment",
        answer: "A Büchner funnel, because I work well under pressure.",
      },
    ],
    alt: "Laura smiling, in glasses and a brown top.",
  },
  {
    id: "lisa-queens",
    name: "Lisa",
    roles: ["Human Practices"],
    study: { year: "1st year", course: "Biochemistry", college: "Queen's" },
    facts: [
      {
        prompt: "Fav song to pipette to",
        answer: "Another Day of Sun from La La Land",
      },
    ],
    alt: "Lisa smiling and waving, in a red patterned top.",
  },
  {
    id: "aliyan",
    name: "Aliyan",
    roles: ["Human Practices", "Dry Lab"],
    study: { year: "1st year", course: "Engineering", college: "University College" },
    facts: [
      {
        prompt: "Fun fact",
        answer: "Is the drummer in 2 bands and a percussionist for OUMS",
      },
    ],
    alt: "Aliyan crouching and laughing, in a black hoodie.",
  },
];

/** The card's anchor: what a search result and a link point at. */
export function memberAnchor(id: string): string {
  return `member-${id}`;
}

/** The label at the card's foot: year, course and college, or for a PI the
 * name with title and the department. */
export function labelOf(member: Member): string[] {
  const { study } = member;
  return study ? [study.year, study.course, study.college] : (member.credit ?? []);
}

/* ---------- the photographs ---------- */

interface Art {
  base: string;
  ext: string;
}

const ART: Art = import.meta.env.DEV
  ? { base: `${import.meta.env.BASE_URL}images-dev/team/`, ext: "png" }
  : { base: "https://static.igem.wiki/teams/6391/wiki/assets/team/", ext: "avif" };
const LOCAL_ART: Art = { base: `${import.meta.env.BASE_URL}local/team/`, ext: "png" };

export interface TeamArt {
  photo: (id: string) => string;
  echo: (id: string) => string;
}

function artAt({ base, ext }: Art): TeamArt {
  return {
    photo: (id) => `${base}${id}.${ext}`,
    echo: (id) => `${base}${id}-echo.${ext}`,
  };
}

/** Where the photographs come from: undefined while that is being found out,
 * null once every source has failed. */
export function useTeamArt(): TeamArt | null | undefined {
  const [art, setArt] = useState<TeamArt | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    const probe = (sources: Art[]) => {
      const [first, ...rest] = sources;
      if (!first) {
        if (live) setArt(null);
        return;
      }
      const img = new Image();
      img.onload = () => live && setArt(artAt(first));
      img.onerror = () => probe(rest);
      img.src = artAt(first).photo(MEMBERS[0].id);
    };
    probe(import.meta.env.DEV ? [ART] : [ART, LOCAL_ART]);
    return () => {
      live = false;
    };
  }, []);
  return art;
}
