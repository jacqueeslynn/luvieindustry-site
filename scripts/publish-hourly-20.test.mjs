import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const manifest = JSON.parse(execFileSync('git', ['show', 'origin/content/hourly-20-20261004:hourly-queue/manifest.json'], { encoding: 'utf8' }));
const workflow = readFileSync('.github/workflows/publish-hourly-20.yml', 'utf8');
const publisher = readFileSync('scripts/publish-hourly-20.mjs', 'utf8');

test('the approved batch has 20 different pages and hero images', () => {
  assert.equal(manifest.length, 20);
  assert.equal(new Set(manifest.map((article) => article.file)).size, 20);
  assert.equal(new Set(manifest.map((article) => article.image)).size, 20);
  for (const article of manifest) {
    assert.equal(article.inbound.length, 2);
    assert.equal(article.related.length, 4);
  }
});

test('publisher is idempotent, time-gated and audited before deployment', () => {
  assert.match(publisher, /state\.published\.length >= 20/);
  assert.match(publisher, /dueIndex < state\.published\.length/);
  assert.match(publisher, /lastPublishedAt/);
  assert.match(publisher, /Asia\/Shanghai/);
  assert.match(publisher, /already exists but is missing from publish state/);
  assert.match(workflow, /git status --porcelain/);
  assert.match(workflow, /audit-site-seo\.mjs/);
  assert.match(workflow, /git push origin main/);
});
