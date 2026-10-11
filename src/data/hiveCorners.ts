/* The words on the hive-corners figure that opens the human practices page
 * (src/components/HiveCorners.tsx): the team's account of how the work was
 * done, the HIVE framework written out in full in the hive's window,
 * and the way on to the other human practices pages.
 *
 * Kept as data rather than typed into the component so that the search
 * index (src/utils/search.ts) reads the same words the figure shows. The
 * paragraphs are plain text with `**bold**`, which is all the figure renders.
 */

export const HIVE_CORNERS = {
  /** The block's id. The timeline deep-links to it, and a search result lands on it. */
  anchor: "how-we-worked",
  /* The page's introduction and the figure's own copy, merged into one
   * account. */
  copy: [
    "**Every answer in the lab raised a new question outside it.** Would beekeepers use NECTAR? Could it harm other organisms? Would a living GMO ever leave the lab? Would it work worldwide? So **human practices came first**, letting evidence, environments and people shape the design.",
    "**Seven questions** run from why Varroa needs new solutions, through our RNAi, chassis, safety and delivery choices, to global adoption. Each goes round the hive (stakeholders, research, modelling, experiments) and then asks what should change. **Every Evaluate ends in a new Hear.** Stakeholders disagreed, and **those trade-offs showed where NECTAR had to adapt**. Our test is **whether NECTAR would look different without these conversations**. So this page covers what they changed, not a headcount.",
  ],
  /** The HIVE framework, in the window the hive (or the "Click to read
   * more" under it) opens. The anchor is the one the page's old "The HIVE
   * framework" heading had, so a link to that still opens it. */
  framework: {
    anchor: "the-hive-framework",
    heading: "The HIVE framework",
    lead: "We created the framework HIVE to guide us through how we should incorporate what we learned from our stakeholders into our project.",
    /** One per corner, in the hive's order. The letter is drawn as a cell
     * beside its paragraph in the window; the paragraph is the team's own. */
    stages: [
      {
        letter: "H",
        text: "**H** stands for **Hear**, which means identifying relevant stakeholders and interviewing them to hear what they have to say about the Varroa problem and what we should do to solve it. Listening to their advice is key to creating and improving our product to actually function in the real world.",
      },
      {
        letter: "I",
        text: "**I** stands for **Investigate**, which includes researching background information and statistics regarding Varroa, current treatments, and current economics. It was very important to dig into the facts of what problems Varroa was causing around the world in order to better understand how we could fix them.",
      },
      {
        letter: "V",
        text: "**V** stands for **Verdict**, which means taking all of the advice we’d learned from our stakeholders and combining it with our background research to come to a conclusion about what changes we should make to improve our product. By taking into account what our stakeholders needed from us and the scientific facts, we hoped to design a product built around the people it’s meant to help.",
      },
      {
        letter: "E",
        text: "**E** stands for **Evaluate**, which means taking the changes we made to our project and assessing whether they would allow our project to have a net positive effect on the world. This includes modelling the impact of Varroa on the world and evaluating if our project is able to solve some of that impact.",
      },
    ],
  },
  onwardLead: "What we researched and developed for our human practices:",
  /** The work done for human practices, each with its own page. Hive
   * modelling is the ecological model, whose page sits under the hidden dry
   * lab group in src/pages.ts rather than under Human practices. */
  onward: [
    { label: "Case Studies", to: "/case-studies" },
    { label: "Economical Modelling", to: "/economic-modelling" },
    { label: "Hive Modelling", to: "/ecological-modelling" },
  ],
};
