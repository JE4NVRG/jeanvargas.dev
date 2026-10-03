import { createElement, type ReactNode } from "react";

export type ReplyInline = { kind: "text" | "strong"; text: string };
export type ReplyListItem = { text: string; ordinal?: number };
export type ReplyBlock =
  | { kind: "paragraph"; text: string; literal?: boolean }
  | { kind: "list"; ordered: boolean; items: ReplyListItem[] };

// Only paired **text** is formatted; other syntax remains escaped plain text.
export function parseReplyInline(text: string): ReplyInline[] {
  const parts: ReplyInline[] = [];
  const pattern = /(?<!\*)\*\*([^\n*]+)\*\*(?!\*)/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    if (!match[1].trim()) continue;
    const index = match.index!;
    if (index > cursor) parts.push({ kind: "text", text: text.slice(cursor, index) });
    parts.push({ kind: "strong", text: match[1] });
    cursor = index + match[0].length;
  }
  if (cursor < text.length) parts.push({ kind: "text", text: text.slice(cursor) });
  return parts;
}

function listItem(line: string): (ReplyListItem & { ordered: boolean }) | null {
  const match = /^(?:([-*•])|(\d{1,3})[.)])[ \t]+(.+)$/.exec(line);
  return match ? { text: match[3], ordered: !!match[2], ...(match[2] ? { ordinal: Number(match[2]) } : {}) } : null;
}

export function parseReplyBlocks(content: string): ReplyBlock[] {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const fence = String.fromCharCode(96).repeat(3);
  const blocks: ReplyBlock[] = [];
  let index = 0;
  while (index < lines.length) {
    if (!lines[index].trim()) { index++; continue; }
    // Unsupported code fences and their contents remain literal.
    if (lines[index].startsWith(fence)) {
      const start = index++;
      while (index < lines.length && !lines[index].startsWith(fence)) index++;
      if (index < lines.length) index++;
      blocks.push({ kind: "paragraph", text: lines.slice(start, index).join("\n"), literal: true });
      continue;
    }
    const first = listItem(lines[index]);
    if (first) {
      const items: ReplyListItem[] = [];
      while (index < lines.length) {
        const item = listItem(lines[index]);
        if (!item || item.ordered !== first.ordered) break;
        index++;
        let text = item.text;
        while (index < lines.length && /^[ \t]{2,}\S/.test(lines[index])) text += "\n" + lines[index++];
        items.push({ text, ...(item.ordinal !== undefined ? { ordinal: item.ordinal } : {}) });
      }
      blocks.push({ kind: "list", ordered: first.ordered, items });
      continue;
    }
    const start = index++;
    while (index < lines.length && lines[index].trim() && !listItem(lines[index]) && !lines[index].startsWith(fence)) index++;
    blocks.push({ kind: "paragraph", text: lines.slice(start, index).join("\n") });
  }
  return blocks;
}

function inlineNodes(text: string): ReactNode[] {
  return parseReplyInline(text).map((part, index) => part.kind === "strong"
    ? createElement("strong", { key: index }, part.text) : part.text);
}

// React escapes every string; there is no raw HTML or active-link renderer.
export function replyContentNodes(content: string): ReactNode[] {
  return parseReplyBlocks(content).map((block, index) => block.kind === "paragraph"
    ? createElement("p", { key: index }, ...(block.literal ? [block.text] : inlineNodes(block.text)))
    : createElement(block.ordered ? "ol" : "ul", { key: index, ...(block.ordered ? { start: block.items[0].ordinal } : {}) },
      ...block.items.map((item, itemIndex) => createElement("li", {
        key: itemIndex, ...(block.ordered ? { value: item.ordinal } : {}),
      }, ...inlineNodes(item.text)))));
}
