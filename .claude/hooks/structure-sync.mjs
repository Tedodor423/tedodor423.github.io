#!/usr/bin/env node
/* PreToolUse reminder: the header structure has a source of truth.
 *
 * references/structure_source.md is the team's agreed page structure, and its
 * own first line says it must always reflect the header. This hook fires on
 * every Write/Edit to the files that define that header — src/pages.ts and
 * src/components/Navbar.tsx — and injects the current structure file into
 * context, so the assistant mirrors any menu change into it in the same
 * sitting instead of forgetting it exists.
 *
 * Advisory, never blocking: references/ is gitignored, so on a checkout
 * without it (CI, a collaborator without the team folder) there is nothing to
 * sync and the hook stays silent about the file's contents.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const STRUCTURE = join(HERE, "..", "..", "references", "structure_source.md");

function inScope(filePath) {
  const path = String(filePath || "").split("\\").join("/");
  return (
    path.endsWith("/src/pages.ts") ||
    path.endsWith("/src/components/Navbar.tsx")
  );
}

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

let event;
try {
  event = JSON.parse(raw || "{}");
} catch {
  process.exit(0);
}

if (!inScope((event.tool_input || {}).file_path)) process.exit(0);

let body =
  "This file defines the wiki's header. The agreed structure lives in " +
  "references/structure_source.md and must always reflect the header: if " +
  "this edit adds, removes, renames, moves or re-paths anything in the menu, " +
  "update references/structure_source.md in the same sitting.";

try {
  body += `\n\n--- current references/structure_source.md ---\n${readFileSync(STRUCTURE, "utf8")}`;
} catch {
  body +=
    "\n(references/structure_source.md is not present in this checkout — " +
    "references/ is gitignored team material. Flag the change to the team " +
    "instead.)";
}

process.stdout.write(
  JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: body,
    },
  }),
);
