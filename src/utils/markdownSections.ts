export interface HeadingChunk {
  /** The heading text, without its hashes. */
  title: string;
  /** Everything under the heading, up to the next heading of the same level. */
  body: string;
}

/**
 * Splits Markdown at headings of exactly `level`, stepping over fenced blocks
 * so a heading inside one stays source code. Anything above the first such
 * heading is the intro.
 */
export function splitAt(markdown: string, level: number) {
  const marker = new RegExp(`^#{${level}}\\s+(.*)$`);
  const intro: string[] = [];
  const chunks: { title: string; lines: string[] }[] = [];
  let fenced = false;

  for (const line of markdown.split("\n")) {
    if (/^\s{0,3}(```|~~~)/.test(line)) fenced = !fenced;
    const match = fenced ? null : marker.exec(line);
    if (match) {
      chunks.push({ title: match[1].trim(), lines: [] });
    } else {
      (chunks.length ? chunks[chunks.length - 1].lines : intro).push(line);
    }
  }

  return {
    intro: intro.join("\n").trim(),
    chunks: chunks.map(
      ({ title, lines }): HeadingChunk => ({
        title,
        body: lines.join("\n").trim(),
      }),
    ),
  };
}
