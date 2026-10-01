import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { COMPANY } from "./company";
import { requestsContact, requestsWhatsApp } from "../components/concierge/contact-intent";

for (const text of [
  "Quero integrar WhatsApp no painel de estoque da oficina.",
  "I need a WhatsApp integration in the inventory dashboard.",
  'Exemplo: "quero falar com Jean pelo WhatsApp".',
  'Translate: "I want to speak to Jean on WhatsApp".',
]) {
  test(`product integrations and quoted examples do not route to a human: ${text}`, () => {
    assert.equal(requestsContact(text), false);
    assert.equal(requestsWhatsApp(text), false);
  });
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    const file = path.join(dir, item.name);
    return item.isDirectory() ? sourceFiles(file) : /\.tsx?$/.test(item.name) && !item.name.endsWith(".test.ts") ? [file] : [];
  });
}

test("production source has no stale literal WhatsApp destinations", () => {
  const expected = new URL(COMPANY.whatsappUrl).pathname.slice(1);
  for (const file of sourceFiles(path.resolve("src"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/https:\/\/wa\.me\/(\d+)/g)) {
      assert.equal(match[1], expected, `Stale WhatsApp in ${file}`);
    }
  }
});
