import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/publish-articles.yml", "utf8");
const publisher = readFileSync("scripts/publish-next-articles.mjs", "utf8");

test("legacy publisher remains manually available with retry safety and unique visuals", () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /- cron:/);
  assert.match(workflow, /git diff --quiet/);
  assert.match(publisher, /already published for/i);
  assert.match(publisher, /content-publish-state\.json/);
  assert.match(publisher, /slice\(0, limit\)/);
  assert.match(publisher, /unique hero image/i);
  assert.match(workflow, /audit-site-seo\.mjs/);
  assert.match(publisher, /G-VCLMP6Q5KJ/);
  assert.match(publisher, /1331142262420820/);
});
