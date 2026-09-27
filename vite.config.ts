import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
// Import directly, NOT from the ./src/utils barrel. The barrel re-exports
// getPathMapping, which pulls in pages.ts and its `.md?raw` imports. Vite bundles
// this config with a standalone esbuild pass that has no `?raw` loader, so going
// through the barrel breaks `vite build` with:
//   "No loader is configured for .md files"
import { stringToSlug } from "./src/utils/stringToSlug";

/* Serves the gitignored stakeholder photos to the DEV server only, at
 * <base>/stakeholder-photos/<basename>.avif, so the human-practices map shows
 * real faces while we work. Nothing is copied into the build: the published
 * site asks static.igem.wiki and shows silhouettes until the photos go
 * through the uploads tool (see wiki-assets-source/stakeholder-photos/
 * README.md). The requested .avif name is matched to whichever source file
 * exists, because the uploads tool converts to .avif but the originals are
 * jpg and png.
 *
 * The four withheld interviews are refused by name: their consent is
 * outstanding, so their faces do not render even on a dev screen, and a
 * data-file mistake that pointed at one would show a silhouette, not a face.
 */
function stakeholderPhotosDevServer(): Plugin {
  const dir = join(__dirname, "wiki-assets-source", "stakeholder-photos");
  const WITHHELD = ["colin", "comvita--evans", "morrison", "coy"];
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = (req.url ?? "").split("?")[0];
    const match = url.match(/\/stakeholder-photos\/([a-z0-9-]+)\.\w+$/);
    if (!match || WITHHELD.includes(match[1])) return next();
    for (const ext of ["jpg", "png"] as const) {
      const file = join(dir, `${match[1]}.${ext}`);
      if (!existsSync(file)) continue;
      res.setHeader(
        "Content-Type",
        ext === "png" ? "image/png" : "image/jpeg",
      );
      res.end(readFileSync(file));
      return;
    }
    next();
  };
  return {
    name: "stakeholder-photos-dev-server",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

/* Same arrangement for the figure artwork whose sources live in the
 * gitignored wiki-assets-source/images_dev/: the DEV server answers
 * <base>/images-dev/<basename>.<ext> straight from that folder, so a figure
 * can show an asset before its upload. The published site references only the
 * static.igem.wiki URL the upload will have (the tool keeps the basename). */
function imagesDevServer(): Plugin {
  const dir = join(__dirname, "wiki-assets-source", "images_dev");
  const TYPES = {
    png: "image/png",
    svg: "image/svg+xml",
    jpg: "image/jpeg",
  } as const;
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = (req.url ?? "").split("?")[0];
    const match = url.match(/\/images-dev\/([a-z0-9-]+)\.(png|svg|jpg)$/);
    if (!match) return next();
    const file = join(dir, `${match[1]}.${match[2]}`);
    if (!existsSync(file)) return next();
    res.setHeader("Content-Type", TYPES[match[2] as keyof typeof TYPES]);
    res.end(readFileSync(file));
  };
  return {
    name: "images-dev-server",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vitejs.dev/config/
export default () => {
  const env = loadEnv("dev", process.cwd());
  return defineConfig({
    base: `/${stringToSlug(env.VITE_TEAM_NAME)}/`,
    plugins: [react(), stakeholderPhotosDevServer(), imagesDevServer()],
    server: { port: 5175 },
    preview: { port: 5175 },
  });
};
