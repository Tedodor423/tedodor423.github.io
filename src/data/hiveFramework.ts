/* The HIVE framework, written out in full in the window that the opening of
 * the human practices page opens (src/components/HiveFramework.tsx).
 *
 * Kept as data rather than typed into the component so that the search
 * index (src/utils/search.ts) reads the same words the window shows. The
 * paragraphs are plain text with `**bold**`, which is all the window renders.
 */

export const HIVE_FRAMEWORK = {
  /** The window's id. A link or a search result naming it opens it; it is
   * the anchor the page's old "The HIVE framework" heading had, so a link to
   * that still opens it. */
  anchor: "the-hive-framework",
  heading: "The HIVE framework",
  lead: "We created the framework HIVE to guide us through how we should incorporate what we learned from our stakeholders into our project.",
  /** One per corner of the hive, in its order. The letter is drawn as a
   * cell beside its paragraph; the paragraph is the team's own. */
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
};
