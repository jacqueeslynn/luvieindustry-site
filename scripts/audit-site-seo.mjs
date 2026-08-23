import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(root, 'articles');
const articleFiles = fs.readdirSync(articleDir)
  .filter((file) => file.endsWith('.html') && file !== 'index.html')
  .sort();
const issues = [];
const titles = new Map();
const descriptions = new Map();
const incoming = new Map(articleFiles.map((file) => [file, 0]));

const add = (file, message) => issues.push(`${file}: ${message}`);
const text = (html) => html.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').trim();

for (const file of articleFiles) {
  const source = fs.readFileSync(path.join(articleDir, file), 'utf8');
  const title = text(source.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  const description = source.match(/<meta name="description" content="([^"]*)">/)?.[1] ?? '';
  const canonical = source.match(/<link rel="canonical" href="([^"]+)">/)?.[1] ?? '';
  const h1Count = (source.match(/<h1\b/g) ?? []).length;
  const topicBlock = source.match(/<!-- topic-cluster-links:start -->([\s\S]*?)<!-- topic-cluster-links:end -->/)?.[1] ?? '';
  const topicTargets = [...topicBlock.matchAll(/href="([^"]+\.html)"/g)].map((match) => match[1]);
  const externalSources = [...source.matchAll(/<a[^>]+href="(https:\/\/[^\"]+)"[^>]*rel="[^"]*external[^"]*"/g)]
    .map((match) => match[1]);

  if (title.length < 45 || title.length > 65) add(file, `title length ${title.length} (target 45–65)`);
  if (description.length < 120 || description.length > 170) add(file, `description length ${description.length} (target 120–170)`);
  if (h1Count !== 1) add(file, `${h1Count} H1 elements`);
  if (canonical !== `https://luvieindustry.com/articles/${file}`) add(file, 'canonical mismatch');
  if (!source.includes('<meta name="robots" content="index, follow, max-image-preview:large">')) add(file, 'missing indexable robots meta');
  if ((source.match(/<meta name="robots"/g) ?? []).length !== 1) add(file, 'duplicate robots metadata');
  if ((source.match(/<meta property="og:title"/g) ?? []).length !== 1) add(file, 'duplicate Open Graph title');
  if ((source.match(/<meta name="twitter:title"/g) ?? []).length !== 1) add(file, 'duplicate Twitter title');
  if (!source.includes('<meta property="og:title"')) add(file, 'missing Open Graph title');
  if (!source.includes('<meta name="twitter:title"')) add(file, 'missing Twitter title');
  if (topicTargets.length !== 4) add(file, `expected 4 topic links, found ${topicTargets.length}`);
  if (!externalSources.length) add(file, 'missing contextual external authority source');
  if (file !== 'wall-panel-standards-evidence-guide.html' && !source.includes('<!-- authority-evidence:start -->')) add(file, 'missing independent-evidence block');
  if (file === 'wall-panel-standards-evidence-guide.html' && externalSources.length < 10) add(file, `expected at least 10 primary sources, found ${externalSources.length}`);
  for (const target of topicTargets) {
    if (!incoming.has(target)) add(file, `broken article link ${target}`);
    else incoming.set(target, incoming.get(target) + 1);
  }

  for (const image of source.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const relative = image[1].replace(/^\.\.\//, '');
    if (!relative.startsWith('http') && !fs.existsSync(path.join(root, relative))) add(file, `missing image ${image[1]}`);
  }

  for (const json of source.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json[1]);
    } catch (error) {
      add(file, `invalid JSON-LD (${error.message})`);
    }
  }

  if (titles.has(title)) add(file, `duplicate title with ${titles.get(title)}`);
  else titles.set(title, file);
  if (descriptions.has(description)) add(file, `duplicate description with ${descriptions.get(description)}`);
  else descriptions.set(description, file);
}

for (const [file, count] of incoming) {
  if (count < 2) add(file, `only ${count} incoming topic links`);
}

const hub = fs.readFileSync(path.join(articleDir, 'index.html'), 'utf8');
for (const file of articleFiles) {
  if (!hub.includes(`href="${file}"`)) add('articles/index.html', `missing card for ${file}`);
}
if (!hub.includes('"@type": "ItemList"')) add('articles/index.html', 'missing ItemList schema');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of articleFiles) {
  if (!sitemap.includes(`https://luvieindustry.com/articles/${file}`)) add('sitemap.xml', `missing ${file}`);
}

for (const file of ['index.html', 'articles/index.html', ...articleFiles.map((name) => `articles/${name}`)]) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (/wall-panel-projects\.png/.test(source)) add(file, 'references retired image containing Chinese text');
}

if (issues.length) {
  console.error(`SEO audit failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${articleFiles.length} articles, unique metadata, valid schemas, four topic links per article, at least two incoming topic links, and complete sitemap coverage.`);
