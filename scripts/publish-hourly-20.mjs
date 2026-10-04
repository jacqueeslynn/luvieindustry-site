import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRef = 'origin/content/hourly-20-20261004';
const planPath = path.join(root, '.github', 'hourly-publication-plan.json');
const statePath = path.join(root, '.github', 'hourly-publish-state.json');
const dryRun = process.argv.includes('--dry-run');
const publishFirst = process.argv.includes('--publish-first');
const nowArg = process.argv.find((arg) => arg.startsWith('--now='));
const now = nowArg ? new Date(nowArg.slice(6)) : new Date();
if (Number.isNaN(now.valueOf())) throw new Error('Invalid --now timestamp.');
if (!fs.existsSync(planPath)) {
  console.log('Hourly publication plan is not yet approved; no article published.');
  process.exit(0);
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
if (plan.status !== 'active' && !dryRun && !publishFirst) {
  console.log('Hourly publication plan is awaiting the timing decision; no article published.');
  process.exit(0);
}
if (plan.stopAt && now.valueOf() > new Date(plan.stopAt).valueOf()) {
  console.log(`This publication window ended at ${plan.stopAt}; remaining articles are held.`);
  process.exit(0);
}
const manifest = JSON.parse(execFileSync('git', ['show', `${sourceRef}:hourly-queue/manifest.json`], { cwd: root, encoding: 'utf8' }));
if (manifest.length !== 20 || plan.files.length !== 20) throw new Error('Expected a 20-article plan and source manifest.');
if (manifest.some((entry, index) => entry.file !== plan.files[index])) throw new Error('Plan order does not match approved source branch.');
if (new Set(manifest.map((entry) => entry.image)).size !== 20) throw new Error('Hero images are not unique.');
if (!Number.isInteger(plan.intervalMinutes) || plan.intervalMinutes < 30) throw new Error('Invalid publication interval.');
const startAt = new Date(plan.startAt);
if (Number.isNaN(startAt.valueOf())) throw new Error('Invalid plan startAt.');

const elapsed = now.valueOf() - startAt.valueOf();
const dueIndex = Math.floor(elapsed / (plan.intervalMinutes * 60_000));
const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : { published: [], lastPublishedAt: null };
if (publishFirst && state.published.length !== 0) throw new Error('--publish-first is only valid before the first release.');
if (state.published.length >= 20) { console.log('All 20 articles are already published.'); process.exit(0); }
if (dueIndex < state.published.length) { console.log(`No article due yet at ${now.toISOString()}.`); process.exit(0); }
if (state.lastPublishedAt && now.valueOf() - new Date(state.lastPublishedAt).valueOf() < plan.intervalMinutes * 60_000) {
  console.log(`Waiting for the ${plan.intervalMinutes}-minute publication interval.`);
  process.exit(0);
}

const entry = manifest[state.published.length];
const articlePath = path.join(root, 'articles', entry.file);
if (fs.existsSync(articlePath)) throw new Error(`Article already exists but is missing from publish state: ${entry.file}`);
if (!fs.existsSync(path.join(root, entry.image))) throw new Error(`Missing article image: ${entry.image}`);
const source = execFileSync('git', ['show', `${sourceRef}:hourly-queue/articles/${entry.file}`], { cwd: root, encoding: 'utf8' });
if (!source.includes('__PUBLISHED_DATE__') || !source.includes('2026-hourly-20')) throw new Error('Source article is missing release placeholders.');
const shanghaiDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
const humanDate = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'long', day: 'numeric' }).format(now);
const page = source.replaceAll('__PUBLISHED_DATE__', shanghaiDate).replaceAll('__PUBLISHED_HUMAN__', humanDate);
const updatedInbound = new Map();
for (const file of entry.inbound) {
  const target = path.join(root, 'articles', file);
  let html = fs.readFileSync(target, 'utf8');
  if (html.includes(`href="${entry.file}"`)) continue;
  if (!html.includes('</article>')) throw new Error(`Cannot add inbound link to ${file}.`);
  const link = `<p class="related-note">Related buyer question: <a href="${entry.file}">${entry.title}</a>.</p>`;
  html = html.replace('</article>', `${link}</article>`);
  updatedInbound.set(target, html);
}
let sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const url = `https://luvieindustry.com/articles/${entry.file}`;
if (sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`Sitemap already lists unpublished article ${entry.file}.`);
for (const loc of ['https://luvieindustry.com/', 'https://luvieindustry.com/articles/']) {
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<loc>${escaped}<\\/loc>\\s*<lastmod>)[^<]+`);
  if (!pattern.test(sitemap)) throw new Error(`Sitemap is missing lastmod for ${loc}.`);
  sitemap = sitemap.replace(pattern, `$1${shanghaiDate}`);
}
sitemap = sitemap.replace('</urlset>', `    <url>\n        <loc>${url}</loc>\n        <lastmod>${shanghaiDate}</lastmod>\n        <priority>0.8</priority>\n    </url>\n</urlset>`);
if (dryRun) {
  console.log(`Would publish ${entry.file} at ${now.toISOString()} (${shanghaiDate}).`);
  process.exit(0);
}
fs.writeFileSync(articlePath, page);
for (const [target, html] of updatedInbound) fs.writeFileSync(target, html);
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
execFileSync('node', ['scripts/build-resource-hub.mjs'], { cwd: root, stdio: 'inherit' });
state.published.push(entry.file);
state.lastPublishedAt = now.toISOString();
fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
console.log(`Published ${url} (${state.published.length}/20).`);
