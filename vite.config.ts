import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// Import directly, NOT from the ./src/utils barrel. The barrel re-exports
// getPathMapping, which pulls in pages.ts and its `.md?raw` imports. Vite bundles
// this config with a standalone esbuild pass that has no `?raw` loader, so going
// through the barrel breaks `vite build` with:
//   "No loader is configured for .md files"
import { stringToSlug } from "./src/utils/stringToSlug";

// https://vitejs.dev/config/
export default () => {
  const env = loadEnv("dev", process.cwd());
  return defineConfig({
    base: `/${stringToSlug(env.VITE_TEAM_NAME)}/`,
    plugins: [react()],
  });
};
