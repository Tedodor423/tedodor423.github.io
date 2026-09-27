/* One icon per hexagon on the engineering comb, keyed by the family id that
 * DbtlGallery gives each cell (`family-` plus the slug of its `##` heading in
 * src/content/cycle-families.md). A family missing from this map has no icon.
 *
 * The drawings are the team's own Excalidraw icons. Like the bee scene's
 * artwork (BeeScene.tsx) they are served from static.igem.wiki, uploaded under
 * assets/eng-icons/ with the uploads tool. The sources live in the gitignored
 * wiki-assets-source/images_dev/eng-icons/; the upload-ready copies, with the
 * <?xml> and <!DOCTYPE> lines the uploader rejects already stripped, are in
 * eng-icons-upload/ next to it.
 *
 * TEMPORARY FALLBACK. Until the upload is done, the comb falls back to copies in
 * the gitignored public/local/eng-icons/, which only exist on a machine that has
 * them; CI builds without that folder. Once the static.igem.wiki URLs answer,
 * drop LOCAL_ICONS and the onError fallback in DbtlGallery. */
const ASSETS = "https://static.igem.wiki/teams/6391/wiki/assets/eng-icons/";
const LOCAL_ICONS = `${import.meta.env.BASE_URL}local/eng-icons/`;

const FILES: Record<string, string> = {
  "family-dry-lab-choosing-the-sequence": "choosing-sequence.svg",
  "family-dry-lab-modelling-the-efficacy": "modelling-efficacy.svg",
  "family-wet-lab-making-the-molecule": "making-molecule.svg",
  "family-wet-lab-where-the-dsrna-is-made": "where-made.svg",
  "family-wet-lab-measuring-dsrna-in-bee-material": "measuring-dsRNA.svg",
  "family-wet-lab-functionalising-the-dsrna": "functionalising-dsrna.svg",
  "family-bee-lab-delivering-a-dose": "delivery.svg",
  "family-bee-lab-sampling-haemolymph": "haemolymph.svg",
  "family-bee-lab-working-with-larvae": "larvae.svg",
  "family-bee-lab-killing-the-mite": "killing-mite.svg",
};

/** Where a family's icon is served from, and the local copy to try if not. */
export function cycleIcon(
  familyId: string,
): { src: string; fallback: string } | null {
  const file = FILES[familyId];
  return file ? { src: ASSETS + file, fallback: LOCAL_ICONS + file } : null;
}
