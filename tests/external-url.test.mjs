import assert from "node:assert/strict";
import test from "node:test";
import { safeExternalUrl } from "../src/lib/external-url.ts";

test("external links allow HTTP and HTTPS", () => {
  assert.equal(safeExternalUrl("https://example.com/place"), "https://example.com/place");
  assert.equal(safeExternalUrl("http://example.com"), "http://example.com/");
});
test("unsafe, relative, empty and credential URLs are rejected", () => {
  for (const value of [null, "", "/place", "not a URL", "javascript:alert(1)", "data:text/html,test", "file:///test", "https://user@example.com", "https://user:password@example.com", "https://:password@example.com"]) {
    assert.equal(safeExternalUrl(value), null, String(value));
  }
});
