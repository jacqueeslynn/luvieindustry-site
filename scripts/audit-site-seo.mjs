import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(root, 'articles');
const articleFiles = fs.readdirSync(articleDir)
  .filter((file) => file.endsWith('.html') && file !== 'index.html')
  .sort();
const productFiles = fs.readdirSync(path.join(root, 'products'))
  .filter((file) => file.endsWith('.html'))
  .sort();
const issues = [];
const titles = new Map();
const descriptions = new Map();
const incoming = new Map(articleFiles.map((file) => [file, 0]));
const seriesImages = new Map();
const latestSeriesFiles = [];
let latestArticleModified = '';

const add = (file, message) => issues.push(`${file}: ${message}`);
const text = (html) => html.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').trim();

for (const file of articleFiles) {
  const source = fs.readFileSync(path.join(articleDir, file), 'utf8');
  const title = text(source.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  const description = source.match(/<meta name="description" content="([^"]*)">/)?.[1] ?? '';
  const canonical = source.match(/<link rel="canonical" href="([^"]+)">/)?.[1] ?? '';
  const contentSeries = source.match(/<meta name="content-series" content="([^"]+)">/)?.[1] ?? '';
  const modified = source.match(/<meta property="article:modified_time" content="(\d{4}-\d{2}-\d{2})">/)?.[1] ?? '';
  const socialImage = source.match(/<meta property="og:image" content="([^"]+)">/)?.[1] ?? '';
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
  if (!source.includes('G-VCLMP6Q5KJ')) add(file, 'missing GA4 page tag');
  if (!source.includes('1331142262420820')) add(file, 'missing Meta Pixel page tag');
  if (contentSeries) {
    if (contentSeries === '2026-v8') latestSeriesFiles.push(file);
    if (!socialImage) add(file, `missing Open Graph image for ${contentSeries}`);
    else if (seriesImages.has(`${contentSeries}:${socialImage}`)) add(file, `reuses series hero image from ${seriesImages.get(`${contentSeries}:${socialImage}`)}`);
    else seriesImages.set(`${contentSeries}:${socialImage}`, file);
  }
  if (modified > latestArticleModified) latestArticleModified = modified;
  if (topicTargets.length !== 4) add(file, `expected 4 topic links, found ${topicTargets.length}`);
  if (!externalSources.length) add(file, 'missing contextual external authority source');
  if (file !== 'wall-panel-standards-evidence-guide.html' && !source.includes('<!-- authority-evidence:start -->')) add(file, 'missing independent-evidence block');
  if (file === 'wall-panel-standards-evidence-guide.html' && externalSources.length < 10) add(file, `expected at least 10 primary sources, found ${externalSources.length}`);
  const contextualTargets = new Set([...source.matchAll(/href="([^"/#]+\.html)"/g)].map((match) => match[1]));
  for (const target of contextualTargets) {
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
for (const [locale, htmlLang, direction] of [['es', 'es', 'ltr'], ['pt-br', 'pt-BR', 'ltr'], ['ar', 'ar', 'rtl']]) {
  for (const route of ['index.html', 'products/pvc-wall-panels.html', 'products/wpc-wall-panels.html', 'contact.html']) {
    const file = `${locale}/${route}`;
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const url = `https://luvieindustry.com/${locale}/${route === 'index.html' ? '' : route}`;
    const htmlTag = source.match(/<html\b[^>]*>/)?.[0] ?? '';
    const linkTags = [...source.matchAll(/<link\b[^>]*>/g)].map((match) => match[0]);
    if (!htmlTag.includes(`lang="${htmlLang}"`) || !htmlTag.includes(`dir="${direction}"`)) add(file, 'wrong page language or direction');
    if (!linkTags.some((tag) => tag.includes('rel="canonical"') && tag.includes(`href="${url}"`))) add(file, 'missing self canonical');
    if (!linkTags.some((tag) => tag.includes('rel="alternate"') && tag.includes(`hreflang="${htmlLang}"`) && tag.includes(`href="${url}"`))) add(file, 'missing self hreflang');
    if (!sitemap.includes(`<loc>${url}</loc>`)) add('sitemap.xml', `missing ${file}`);
    for (const image of source.matchAll(/<img[^>]+src="([^\"]+)"/g)) {
      if (image[1].startsWith('/') && !fs.existsSync(path.join(root, image[1].slice(1)))) add(file, `missing image ${image[1]}`);
    }
    for (const local of source.matchAll(/<a[^>]+href="(\/[^\"]+)"/g)) {
      const target = local[1].split('#')[0];
      const targetFile = target.endsWith('/') ? `${target}index.html` : target;
      if (!fs.existsSync(path.join(root, targetFile.slice(1)))) add(file, `broken local link ${target}`);
    }
  }
}
const portugueseRelative = 'pt-br/articles/painel-ripado-pvc-parede.html';
const portugueseUrl = `https://luvieindustry.com/${portugueseRelative}`;
const englishRelative = 'articles/fluted-wall-panels-distributor-guide.html';
const englishUrl = `https://luvieindustry.com/${englishRelative}`;
const portuguese = fs.readFileSync(path.join(root, portugueseRelative), 'utf8');
const english = fs.readFileSync(path.join(root, englishRelative), 'utf8');
const spanishRelative = 'es/articles/panel-ranurado-pvc-pared.html';
const arabicRelative = 'ar/articles/fluted-pvc-wall-panels.html';
const spanishUrl = `https://luvieindustry.com/${spanishRelative}`;
const arabicUrl = `https://luvieindustry.com/${arabicRelative}`;
for (const [file, source, canonical] of [[portugueseRelative, portuguese, portugueseUrl], [englishRelative, english, englishUrl], [spanishRelative, fs.readFileSync(path.join(root, spanishRelative), 'utf8'), spanishUrl], [arabicRelative, fs.readFileSync(path.join(root, arabicRelative), 'utf8'), arabicUrl]]) {
  if (!source.includes(`<link rel="canonical" href="${canonical}">`)) add(file, 'missing self canonical');
  for (const [locale, url] of [['en', englishUrl], ['es', spanishUrl], ['pt-BR', portugueseUrl], ['ar', arabicUrl]]) {
    if (!source.includes(`<link rel="alternate" hreflang="${locale}" href="${url}">`)) add(file, `missing ${locale} alternate`);
  }
}
if (!hub.includes('href="../pt-br/articles/painel-ripado-pvc-parede.html"')) add('articles/index.html', 'missing Portuguese guide card');
if (!sitemap.includes(`<loc>${portugueseUrl}</loc>`)) add('sitemap.xml', 'missing Portuguese guide');
if (!sitemap.includes(`<loc>${spanishUrl}</loc>`)) add('sitemap.xml', 'missing Spanish guide');
if (!sitemap.includes(`<loc>${arabicUrl}</loc>`)) add('sitemap.xml', 'missing Arabic guide');
for (const file of articleFiles) {
  if (!sitemap.includes(`https://luvieindustry.com/articles/${file}`)) add('sitemap.xml', `missing ${file}`);
}
const rootLastmod = sitemap.match(/<loc>https:\/\/luvieindustry\.com\/<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '';
const hubLastmod = sitemap.match(/<loc>https:\/\/luvieindustry\.com\/articles\/<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '';
if (!rootLastmod || rootLastmod < latestArticleModified) add('sitemap.xml', `homepage lastmod ${rootLastmod || 'missing'} predates latest article ${latestArticleModified}`);
if (!hubLastmod || hubLastmod < latestArticleModified) add('sitemap.xml', `resource hub lastmod ${hubLastmod || 'missing'} predates latest article ${latestArticleModified}`);

const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const notFoundPage = fs.readFileSync(path.join(root, '404.html'), 'utf8');
if (!notFoundPage.includes('<meta name="robots" content="noindex, follow">')) add('404.html', 'missing noindex directive');
for (const target of ['/', '/articles/', '/products/pvc-wall-panels.html', '/products/wpc-wall-panels.html', '/products/pu-stone-panels.html']) {
  if (!notFoundPage.includes(`href="${target}"`)) add('404.html', `missing recovery route ${target}`);
}
for (const file of productFiles) {
  const relative = `products/${file}`;
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const canonical = `https://luvieindustry.com/${relative}`;
  if (!source.includes(`<link rel="canonical" href="${canonical}">`)) add(relative, 'missing or incorrect canonical');
  if (!source.includes('<meta name="robots" content="index, follow, max-image-preview:large">')) add(relative, 'missing indexable robots meta');
  if ((source.match(/<h1\b/g) ?? []).length !== 1) add(relative, 'expected one H1');
  if (!source.includes('"@type":"CollectionPage"')) add(relative, 'missing CollectionPage schema');
  if (!source.includes('G-VCLMP6Q5KJ') || !source.includes('1331142262420820')) add(relative, 'missing analytics tag');
  if (!homepage.includes(`href="${relative}"`)) add('index.html', `missing direct product link ${relative}`);
  if (!hub.includes(`href="../${relative}"`)) add('articles/index.html', `missing product link ${relative}`);
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) add('sitemap.xml', `missing product ${relative}`);
  for (const image of source.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    if (!fs.existsSync(path.resolve(root, 'products', image[1]))) add(relative, `missing image ${image[1]}`);
  }
  for (const anchor of source.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const href = anchor[1];
    if (href.startsWith('../') && !href.includes('#') && !fs.existsSync(path.resolve(root, 'products', href))) add(relative, `missing local link ${href}`);
  }
}
if (homepage.includes('data-meta-lead')) {
  add('index.html', 'catalog or email-intent clicks must not be counted as confirmed leads');
}
if (!homepage.includes("result.success !== 'true'") || !homepage.includes("window.gtag('event', 'generate_lead'") || !homepage.includes("window.fbq('track', 'Lead'")) {
  add('index.html', 'confirmed website submissions must be the only source of lead events');
}
for (const file of latestSeriesFiles) {
  if (!homepage.includes(`href="articles/${file}"`)) add('index.html', `missing direct discovery link for ${file}`);
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

console.log(`SEO audit passed: ${articleFiles.length} articles and ${productFiles.length} product-family pages, unique article metadata, valid schemas, topic links, and complete sitemap coverage.`);
