#!/usr/bin/env node
/* PreToolUse guard for the anti-vibecoded-design skill.
 *
 * Skills are model-invoked: the description makes loading likely, not certain.
 * This hook removes the judgement call. Every Write/Edit aimed at a design or
 * content file gets the rules injected into context before the edit is made,
 * and the proposed text is scanned for the mechanical tells.
 *
 * In scope: anything under src/ ending .css .tsx .ts .md, plus index.html.
 * Deliberately NOT .claude/ — the skill file itself names every tell it bans,
 * so scanning it would fire on every line.
 *
 * Advisory by design: it reports, it does not block. Several of the 30 items
 * are open decisions on this repo (see "Where this repo stands" in the skill),
 * and a hook that refuses an edit cannot tell a decision from a mistake. To
 * make it blocking instead, set BLOCK to true below.
 *
 * Node, not shell, because the team is on Windows and macOS and this has to
 * behave the same on both. Node is already a hard dependency of the build.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const BLOCK = false;

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = join(HERE, "..", "skills", "anti-vibecoded-design", "SKILL.md");

/* Settled tells only. Em dashes are left out on purpose: there are ~300 across
 * src/content/ already, it is currently the team's voice, and the brand mono
 * face cannot draw the glyph. Flagging it on every edit would be noise until
 * the team decides. Add it here if they do. */
const TELLS = [
  [/linear-gradient|radial-gradient/i, "1", "gradient"],
  /* `inset` is excluded: brand.css uses an inset shadow as the current-page
   * underline, which is a considered choice, not card elevation. */
  [/box-shadow\s*:\s*(?!\s*(none|inset))/i, "5", "drop shadow"],
  [/backdrop-filter|glassmorphism/i, "8", "glassmorphism"],
  [/\blucide\b/i, "2", "Lucide icons"],
  [/\b(Inter|Geist|Space Grotesk)\b/, "10", "default AI font"],
  [
    /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2728}\u{2726}\u{2727}\u{2705}]/u,
    "7, 24",
    "emoji, sparkle or checkmark glyph",
  ],
  [
    /\b(it'?s|it is|this is|that'?s|that is|we'?re|they'?re) not (just )?[^.,;]{1,40}[,;]\s*(it'?s|it is|this is|that'?s|that is|we'?re|they'?re)\b/i,
    "15",
    '"it\'s not X, it\'s Y"',
  ],
];

const REMINDER = [
  "The anti-vibecoded-design skill governs this file.",
  "Rules: .claude/skills/anti-vibecoded-design/SKILL.md",
  "Palette, type and spacing tokens live in src/styles/brand.css — extend that",
  "file rather than introducing a new colour, font or radius here. The three",
  "open deviations it records (white surface, honey left-stripe, em dashes) are",
  "decisions to raise with the team, not to silently fix.",
].join("\n");

function inScope(filePath) {
  const path = String(filePath || "").split("\\").join("/");
  if (path.includes("/.claude/")) return false;
  return /\/src\/.+\.(css|tsx|ts|md)$/.test(path) || /\/index\.html$/.test(path);
}

function proposedText(input) {
  const parts = [input.content, input.new_string];
  for (const edit of input.edits || []) parts.push(edit && edit.new_string);
  return parts.filter((part) => typeof part === "string").join("\n");
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

const input = event.tool_input || {};
if (!inScope(input.file_path)) process.exit(0);

const text = proposedText(input);
const hits = TELLS.filter(([pattern]) => pattern.test(text)).map(
  ([, item, label]) => `  - item ${item}: ${label}`,
);

/* The full skill on the first in-scope edit of the session, a short pointer
 * after that. Injecting 5 KB before every edit would cost more than it buys. */
const stampDir = join(tmpdir(), "nectar-design-guard");
const stamp = join(stampDir, String(event.session_id || "no-session"));
let body;
if (existsSync(stamp)) {
  body = REMINDER;
} else {
  try {
    mkdirSync(stampDir, { recursive: true });
    writeFileSync(stamp, new Date().toISOString());
  } catch {
    /* a tmp we cannot write just means the full text is injected again */
  }
  try {
    body = `${REMINDER}\n\n--- ${SKILL} ---\n${readFileSync(SKILL, "utf8")}`;
  } catch {
    body = REMINDER;
  }
}

if (hits.length) {
  body +=
    `\n\nThis edit's new text matches known AI tells:\n${hits.join("\n")}\n` +
    'Apply the "Do instead" column, or state why it stays.';
}

const out = {
  suppressOutput: true,
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    additionalContext: body,
  },
};

if (hits.length && BLOCK) {
  out.hookSpecificOutput.permissionDecision = "ask";
  out.hookSpecificOutput.permissionDecisionReason = `anti-vibecoded-design tells in this edit:\n${hits.join("\n")}`;
}

process.stdout.write(JSON.stringify(out));
