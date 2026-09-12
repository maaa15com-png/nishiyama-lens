import test from "node:test";
import assert from "node:assert/strict";
import { parseLang, localizedText, languageHref, formatDate } from "../src/lib/language.ts";

test("language accepts only a single en value; everything else defaults to ja", () => {
  assert.equal(parseLang("en"), "en");
  for (const value of [undefined, "ja", "EN", "invalid", ["en", "ja"], ["en"]]) assert.equal(parseLang(value), "ja");
});
test("English preference and per-field Japanese fallback, including blank English", () => {
  assert.deepEqual(localizedText("原文", "English", "en"), { text: "English", lang: "en" });
  for (const en of [null, "", "  "]) assert.deepEqual(localizedText("原文", en, "en"), { text: "原文", lang: "ja" });
  assert.equal(localizedText("原文", "English", "ja").text, "原文");
  assert.equal(localizedText(null, null, "en").text, "");
});
test("switch preserves identifiers, repeated parameters and safely encodes values", () => {
  const url = new URL(languageHref("/news", { lang: ["ja", "en"], courseId: "abc", tag: ["a&b", "two"], skip: undefined }, "en"), "https://example.com");
  assert.deepEqual(url.searchParams.getAll("lang"), ["en"]);
  assert.equal(url.searchParams.get("courseId"), "abc");
  assert.deepEqual(url.searchParams.getAll("tag"), ["a&b", "two"]);
});
test("date uses Japan time across a UTC date boundary", () => {
  assert.match(formatDate(Date.parse("2026-05-01T15:00:00Z"), "en"), /2 May 2026/);
});
