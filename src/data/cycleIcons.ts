import { FAMILIES } from "../utils/dbtlCycles";

/* One icon per hexagon on the engineering comb, keyed by the family id that
 * DbtlGallery gives each cell (`family-` plus the slug of its `##` heading in
 * src/content/cycle-families.md). A family missing from this map has no icon,
 * so RENAMING A `##` HEADING DROPS ITS ICON until the key here is renamed too.
 * The dev server warns when that happens (below).
 *
 * The drawings are the team's own Excalidraw icons, first drawn for the ten
 * families before the 29 Sep renumbering. Each went to the family that took
 * over its cycles: the old "Measuring dsRNA in bee material" split into rt-qPCR
 * (which kept the microscope) and Mango (which reads crude haemolymph, so it
 * took the drop), and "Delivering a dose" and "Sampling haemolymph" merged into
 * the adult bee assays, which kept the syringe.
 *
 * Like the bee scene's artwork (BeeScene.tsx) they are served from
 * static.igem.wiki, uploaded under assets/eng-icons/ with the uploads tool. The
 * sources live in the gitignored wiki-assets-source/images_dev/eng-icons/; the
 * upload-ready copies, with the <?xml> and <!DOCTYPE> lines the uploader
 * rejects already stripped, are in eng-icons-upload/ next to it.
 *
 * TEMPORARY FALLBACK. Until the upload is done, the comb falls back to copies in
 * the gitignored public/local/eng-icons/, which only exist on a machine that has
 * them; CI builds without that folder. Once the static.igem.wiki URLs answer,
 * drop LOCAL_ICONS and the onError fallback in DbtlGallery. */
const ASSETS = "https://static.igem.wiki/teams/6391/wiki/assets/eng-icons/";
const LOCAL_ICONS = `${import.meta.env.BASE_URL}local/eng-icons/`;

const FILES: Record<string, string> = {
  "family-wet-lab-dsrna-design": "making-molecule.svg",
  "family-wet-lab-production-and-delivery-of-dsrna": "where-made.svg",
  "family-wet-lab-optimising-rt-qpcr-for-honeybee-samples":
    "measuring-dsRNA.svg",
  "family-wet-lab-mango": "haemolymph.svg",
  "family-wet-lab-functionalising-the-dsrna": "functionalising-dsrna.svg",
  "family-bee-lab-adult-bee-assays": "delivery.svg",
  "family-bee-lab-larval-assays": "larvae.svg",
  "family-bee-lab-varroa-mite-testing": "killing-mite.svg",
  "family-dry-lab-designing-the-rna-to-kill-mites": "choosing-sequence.svg",
  "family-dry-lab-beehave-modelling": "modelling-efficacy.svg",
};

if (import.meta.env.DEV) {
  const bare = FAMILIES.filter((one) => !FILES[one.id]).map((one) => one.id);
  if (bare.length) {
    console.warn(`cycleIcons.ts: no icon for ${bare.join(", ")}`);
  }
}

/** Where a family's icon is served from, and the local copy to try if not. */
export function cycleIcon(
  familyId: string,
): { src: string; fallback: string } | null {
  const file = FILES[familyId];
  return file ? { src: ASSETS + file, fallback: LOCAL_ICONS + file } : null;
}
