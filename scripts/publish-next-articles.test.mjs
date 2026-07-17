import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/publish-articles.yml", "utf8");
const publisher = readFileSync("scripts/publish-next-articles.mjs", "utf8");

test("daily publisher has retry windows and same-day idempotency", () => {
  assert.ok((workflow.match(/- cron:/g) ?? []).length >= 3);
  assert.match(workflow, /git diff --quiet/);
  assert.match(publisher, /already published for/i);
  assert.match(publisher, /existingLastModified/);
  assert.match(publisher, /G-VCLMP6Q5KJ/);
  assert.match(publisher, /1331142262420820/);
});
