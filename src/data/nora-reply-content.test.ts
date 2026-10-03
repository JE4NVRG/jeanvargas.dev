import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseReplyBlocks, parseReplyInline, replyContentNodes } from "../components/concierge/reply-content-parser";

const render = (text: string) => renderToStaticMarkup(createElement("div", null, ...replyContentNodes(text)));

test("Nora response strings are escaped and all link syntax stays literal", () => {
  const html = render('<img src=x onerror=alert(1)> **<script>alert(1)</script>**\n\n[open](javascript:alert(1)) https://example.com mailto:test@example.com');
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /<strong>&lt;script&gt;alert\(1\)&lt;\/script&gt;<\/strong>/);
  assert.match(html, /\[open\]\(javascript:alert\(1\)\)/);
  assert.match(html, /https:\/\/example\.com/);
  assert.match(html, /mailto:test@example\.com/);
  assert.doesNotMatch(html, /<(?:a|img|script)\b|href=/);
});

test("paragraphs, occasional emoji and restricted bold retain their content", () => {
  const text = "Olá, Ana 👋\r\nVamos explorar sua ideia.\r\n\r\n**Próximo passo:** conte a necessidade 🙂";
  assert.deepEqual(parseReplyBlocks(text), [
    { kind: "paragraph", text: "Olá, Ana 👋\nVamos explorar sua ideia." },
    { kind: "paragraph", text: "**Próximo passo:** conte a necessidade 🙂" },
  ]);
  const html = render(text);
  assert.equal((html.match(/<p>/g) || []).length, 2);
  assert.match(html, /Olá, Ana 👋\nVamos explorar sua ideia\./);
  assert.match(html, /<strong>Próximo passo:<\/strong> conte a necessidade 🙂/);
});

test("semantic lists preserve explicit ordered numbers", () => {
  const html = render("- **Objetivo:** site simples\n- Contexto: profissional autônomo\n\n3. Revisar o resumo\n7) Autorizar o retorno");
  assert.match(html, /<ul><li><strong>Objetivo:<\/strong> site simples<\/li><li>Contexto: profissional autônomo<\/li><\/ul>/);
  assert.match(html, /<ol start="3"><li value="3">Revisar o resumo<\/li><li value="7">Autorizar o retorno<\/li><\/ol>/);
  assert.equal((html.match(/<li\b/g) || []).length, 4);
});

test("unsupported formatting and unmatched markers remain literal", () => {
  const text = "***not bold*** | **unfinished | [label](javascript:x) | <b>literal</b>";
  assert.deepEqual(parseReplyInline(text), [{ kind: "text", text }]);
  const fence = ["\x60\x60\x60js", "- **literal example**", "\x60\x60\x60"].join("\n");
  assert.deepEqual(parseReplyBlocks(fence), [{ kind: "paragraph", text: fence, literal: true }]);
  assert.doesNotMatch(render(fence), /<ul>|<strong>/);
});

test("list continuations and trailing prose retain their full text", () => {
  assert.deepEqual(parseReplyBlocks("• Primeiro ponto 👌\n  detalhe em outra linha\n• Segundo ponto\nAgora uma pergunta."), [
    { kind: "list", ordered: false, items: [{ text: "Primeiro ponto 👌\n  detalhe em outra linha" }, { text: "Segundo ponto" }] },
    { kind: "paragraph", text: "Agora uma pergunta." },
  ]);
});
