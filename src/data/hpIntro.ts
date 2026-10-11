/* The opening of the human practices page (src/components/HpIntro.tsx): the
 * words down the left, and the data the figure beside them draws.
 *
 * The words are the team's own, from the layout mockup of 11 Oct 2026, with
 * the spelling tidied. Kept as data rather than typed into the component so
 * that the search index (src/utils/search.ts) reads the same words the page
 * shows. Inline, `**bold**` and `[text](/path)` links to other pages of the
 * wiki are all that is rendered.
 *
 * TWO DATA SETS ARE STILL TO COME, and the map says so on the page while
 * they are missing. Each one is a plain table below; fill it and the map
 * draws the real thing and drops its TODO, with nothing else to change.
 *
 *  - SURVEY_COUNTS, the survey responses per country. Until it holds
 *    anything, the map scatters SURVEY_PLACEHOLDER_N dots at random over the
 *    land (seeded, so every reader sees the same ones), which the team asked
 *    for as a stand-in.
 *  - VARROA_FIRST_RECORDS, the year Varroa was first recorded in each
 *    country, with a source for each. Until it holds anything, countries
 *    turn red in a stand-in order (outwards from an arbitrary point, see
 *    HpIntro.tsx), which shows how the animation will run and nothing about
 *    the history.
 *
 * Country names are Natural Earth's, as src/utils/hexCountries.ts uses them
 * ("United States of America", "United Kingdom", "Czechia" and so on). A
 * country too small to hold a cell of the hexagon map is not drawn; its
 * responses still count in the headline numbers, which are the team's.
 */

/** Which picture the figure shows beside a step of the copy: the map in
 * one of its states, or the HIVE hive. */
export type IntroState = "survey" | "regions" | "spread" | "hive" | "people";

export interface IntroUse {
  /** One line of the list, inline Markdown. */
  text: string;
  /** What the figure shows while this line is the highlighted one. */
  state: IntroState;
}

export const HP_INTRO = {
  /** The block's id. The timeline deep-links to it, and a search result
   * lands on it. */
  anchor: "how-we-worked",
  interviews: { value: "30", label: "in-depth interviews conducted" },
  /** What the changing faces beside the count are, for a screen reader. */
  facesLabel: "Photographs of some of the people we interviewed",
  reach:
    "We reached out to hundreds of beekeepers, industry experts, academics and policy specialists.",
  survey: { value: "150+", label: "survey responses collected" },
  surveyWhere: "across 10 countries in 5 continents",
  usesLead:
    "Together with data from literature and public datasets, we used the results to:",
  uses: [
    {
      text: "develop [case studies](/case-studies) for the most affected regions: [California](/case-studies/california) and [Australia](/case-studies/australia)",
      state: "regions",
    },
    {
      text: "computationally model the Varroa mite's effects [within a hive](/ecological-modelling), its spread globally, and its [economic impacts](/economic-modelling)",
      state: "spread",
    },
    {
      text: "develop our HIVE framework",
      state: "hive",
    },
    {
      text: "and ultimately inform our [engineering](/engineering), culminating in 3 major pivots of the project",
      state: "people",
    },
  ] satisfies IntroUse[],
  /** The note under the HIVE hive, which opens the framework's window. */
  frameworkButton: "Click to see the explanation",
  /** The two regions the case studies are about, as hexCountries.ts names
   * them, labelled on the map while that line is read. */
  regions: ["California", "Australia"],
  /** Above the warming chart. */
  temperatureTitle:
    "Global surface temperature, °C above the 1951-1980 average",
  /** Shown under the map while its data is a stand-in (see above). */
  todos: {
    survey:
      "Figure: survey responses by country. The dots are placeholders, scattered at random, until the survey export is in. Owner: human practices.",
    spread:
      "Figure: the year Varroa was first recorded in each country, each with its source. The order the countries turn red in is a placeholder until that table is compiled. Owner: human practices.",
  },
};

export interface InterviewImage {
  /** On static.igem.wiki, uploaded through the uploads tool. */
  src: string;
  /** What the picture shows, for a screen reader: who, and where or when. */
  alt: string;
}

/** Screenshots and photographs from the interviews themselves, cycled
 * through the cells beside the interview count. Empty until they are
 * uploaded; until then the cells show the stakeholders' own profile
 * photographs, the ones the stakeholder map below shows (never a withheld
 * interview's). Only pictures the people in them agreed to have published. */
export const INTERVIEW_IMAGES: InterviewImage[] = [];

/** Survey responses per country, by Natural Earth name. Empty until the
 * survey export is in. */
export const SURVEY_COUNTS: Record<string, number> = {};

/** How many stand-in dots the map draws while SURVEY_COUNTS is empty: the
 * "150+" of the headline. */
export const SURVEY_PLACEHOLDER_N = 150;

export interface FirstRecord {
  /** Natural Earth name. */
  country: string;
  /** The year Varroa was first recorded there. */
  year: number;
  /** Where that year comes from: a DOI, a report or a stable URL. */
  source: string;
}

/** The year Varroa was first recorded in each country. Empty until the
 * table is compiled from published sources. */
export const VARROA_FIRST_RECORDS: FirstRecord[] = [];

/** The years the spread animation runs over. */
export const SPREAD_YEARS = { from: 1950, to: 2025 };
