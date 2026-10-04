import fs from 'node:fs';
import path from 'node:path';
import { articles, buyerScenarios } from './hourly-article-data.mjs';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'hourly-queue');
const domain = 'https://luvieindustry.com';
const contact = 'https://wa.me/306947135317?text=Hello%20Luvie%2C%20please%20send%20the%20current%20specification%20and%20sample%20details.';
const htmlEscape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const toPath = (slug) => `${slug}.html`;
const published = '__PUBLISHED_DATE__';
const humanDate = '__PUBLISHED_HUMAN__';

if (articles.length !== 20) throw new Error(`Expected 20 articles, found ${articles.length}.`);
for (const field of ['slug', 'title', 'description', 'question', 'image', 'catalog', 'source', 'related', 'inbound', 'intro', 'answer', 'sections', 'checklist', 'faqs']) {
  if (articles.some((article) => !article[field])) throw new Error(`Missing ${field}.`);
}
if (new Set(articles.map((article) => article.slug)).size !== articles.length) throw new Error('Duplicate slug.');
if (new Set(articles.map((article) => article.image)).size !== articles.length) throw new Error('Hero images must be unique across this batch.');
for (const article of articles) {
  if (!buyerScenarios[article.slug]) throw new Error(`${article.slug}: missing buyer scenario.`);
  if (!fs.existsSync(path.join(root, article.image))) throw new Error(`Missing image: ${article.image}`);
  if (!fs.existsSync(path.join(root, article.catalog))) throw new Error(`Missing catalog: ${article.catalog}`);
  if (article.related.length !== 4) throw new Error(`${article.slug}: expected four related articles.`);
  if (article.inbound.length !== 2) throw new Error(`${article.slug}: expected two inbound article sources.`);
  for (const file of [...article.related, ...article.inbound]) {
    if (!fs.existsSync(path.join(root, 'articles', file))) throw new Error(`${article.slug}: missing linked article ${file}`);
  }
}

fs.mkdirSync(path.join(output, 'articles'), { recursive: true });
const manifest = articles.map(({ slug, title, description, image, inbound, related }) => ({ file: toPath(slug), title, description, image, inbound, related }));
fs.writeFileSync(path.join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

for (const article of articles) {
  const file = toPath(article.slug);
  const url = `${domain}/articles/${file}`;
  const imageUrl = `${domain}/${article.image}`;
  const sourceUrl = article.source[0];
  const seoTitle = article.title.length > 57 ? article.title : `${article.title} | Luvie`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${domain}/#organization`, name: 'Luvie Industry', legalName: 'Haining Luvie Import & Export Co., Ltd.', url: `${domain}/`, logo: `${domain}/assets/brand/luvie-logo.webp`, telephone: '+30 6947135317' },
    { '@type': 'Article', headline: article.question, description: article.description, image: imageUrl, datePublished: published, dateModified: published, author: { '@id': `${domain}/#organization` }, publisher: { '@id': `${domain}/#organization` }, mainEntityOfPage: url, citation: [sourceUrl] },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${domain}/` }, { '@type': 'ListItem', position: 2, name: 'Resources', item: `${domain}/articles/` }, { '@type': 'ListItem', position: 3, name: article.question, item: url }] },
  ] };
  const related = article.related.map((target) => `<a href="${target}">${htmlEscape(target.replace('.html', '').replaceAll('-', ' '))}</a>`).join('\n');
  const sections = article.sections.map(([heading, body]) => `<section><h2>${htmlEscape(heading)}</h2><p>${htmlEscape(body)}</p></section>`).join('\n');
  const checklist = article.checklist.map((item) => `<li>${htmlEscape(item)}</li>`).join('');
  const faqs = article.faqs.map(([question, answer]) => `<details><summary>${htmlEscape(question)}</summary><p>${htmlEscape(answer)}</p></details>`).join('\n');
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${htmlEscape(seoTitle)}</title><meta name="description" content="${htmlEscape(article.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="Luvie Industry"><meta name="content-series" content="2026-hourly-20"><link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Luvie Industry"><meta property="og:title" content="${htmlEscape(seoTitle)}"><meta property="og:description" content="${htmlEscape(article.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${imageUrl}"><meta property="article:published_time" content="${published}"><meta property="article:modified_time" content="${published}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${htmlEscape(seoTitle)}"><meta name="twitter:description" content="${htmlEscape(article.description)}"><meta name="twitter:image" content="${imageUrl}">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/brand/favicon-32.png"><link rel="apple-touch-icon" href="../assets/brand/apple-touch-icon.png"><link rel="stylesheet" href="styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script>
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1331142262420820');fbq('track','PageView');</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VCLMP6Q5KJ');</script>
</head><body><header class="site-header"><div class="nav"><a class="brand" href="../"><strong>Luvie Industry</strong><span>Wall systems for global partners</span></a><nav class="nav-links"><a href="../">Home</a><a href="./">Resources</a><a href="../products/pvc-wall-panels.html">PVC panels</a></nav><a class="nav-cta" href="${contact}">Discuss your market</a></div></header>
<main class="container article-layout"><article class="article-body"><nav class="breadcrumbs"><a href="../">Home</a><span>/</span><a href="./">Resources</a><span>/</span><span>${htmlEscape(article.category)}</span></nav><div class="article-meta"><span>${htmlEscape(article.category)}</span><span>Published <time datetime="${published}">${humanDate}</time></span></div><p class="article-byline">By Luvie Industry · Buyer resource</p><h1>${htmlEscape(article.question)}</h1>
<!-- topic-cluster-links:start --><nav class="related" aria-label="Related buyer guides"><strong>Continue your research</strong><p>${related}</p></nav><!-- topic-cluster-links:end -->
<!-- authority-evidence:start --><aside class="authority-evidence" aria-label="Independent evidence"><strong>Independent evidence</strong><p><a href="${sourceUrl}" rel="noopener noreferrer external">${htmlEscape(article.source[1])}</a>: ${htmlEscape(article.source[2])} This source does not certify a Luvie product; request evidence for the exact SKU.</p></aside><!-- authority-evidence:end -->
<p class="lead">${htmlEscape(article.intro)}</p><figure class="article-visual"><img src="../${article.image}" alt="${htmlEscape(article.alt)}" loading="eager" decoding="async"><figcaption>Illustrative context or catalog image, not proof of a real project or a test result.</figcaption></figure>
<div class="answer-box"><strong>Short answer</strong><p>${htmlEscape(article.answer)}</p></div>${sections}
<section><h2>Illustrative buyer situation</h2><p>${htmlEscape(buyerScenarios[article.slug])}</p></section>
<section><h2>Buyer checklist before ordering</h2><ul class="checklist">${checklist}</ul><p>Save the approved sample, product code and document references with the purchase order. A catalog helps shortlist a finish but does not establish the final specification, local acceptance, price or delivery terms.</p></section>
<section><h2>Common buyer questions</h2><div class="faq-list">${faqs}</div></section>
<section><h2>Compare the range and request the exact specification</h2><p>Browse the <a href="../${article.catalog}">relevant product catalog (PDF, English)</a>, then tell Luvie the destination market, room or project use, approximate quantity and the finish you want to sample. We can discuss which current SKU and documents are available; do not assume a catalog image establishes certification or a guaranteed lead time.</p></section>
<div class="cta-box"><span>Sample before scale</span><h2>Turn the question into a verifiable product brief.</h2><p>Send the application and target market so the conversation starts with a specific product, sample and evidence request.</p><a class="button" href="${contact}">Ask Luvie about this use</a></div></article><aside class="side-panel"><div class="toc"><strong>Buyer resource</strong><p>Product-specific price, MOQ, stock, lead time, test evidence and destination approval require written confirmation for the exact order. Illustrative images do not document a real project.</p></div><div class="fact-card"><span>Contact Luvie</span><b>PVC · WPC · Decorative panels</b><p>Share your country, application and selected sample to discuss the right next step.</p></div></aside></main><footer class="footer"><div class="container"><a href="https://wa.me/306947135317">WhatsApp / Phone: +30 6947135317</a> · <a href="mailto:jinsburg@luvieindustry.com">jinsburg@luvieindustry.com</a></div></footer></body></html>\n`;
  fs.writeFileSync(path.join(output, 'articles', file), page);
}
console.log(`Built ${articles.length} staged articles in ${output}`);
