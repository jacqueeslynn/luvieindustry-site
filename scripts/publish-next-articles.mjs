import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const sourceBranch = 'origin/feature/seo-geo-content-v7';
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number.parseInt(limitArg.replace('--limit=', ''), 10) : 1;
const today = new Date().toISOString().slice(0, 10);
const statePath = '.github/content-publish-state.json';
const whatsapp = 'https://wa.me/306947135317?text=Hello%20Luvie%2C%20I%20would%20like%20product%20information%20and%20samples.';

const queue = [
  {
    file: 'spc-flooring-distributor-spec-guide.html', release: 'v7-spc-flooring-spec',
    title: 'SPC Flooring Specifications for Distributors | Luvie',
    cardTitle: 'SPC Flooring Specifications: Distributor Buyer Guide', category: 'SPC flooring',
    description: 'A B2B specification guide for distributors comparing SPC flooring core, wear layer, IXPE, lock, plank format and packing before approving a SKU.',
    sourceImage: 'luvie-spc-flooring-application-context-v1.webp', image: 'spc-flooring-application-context.webp',
    imageAlt: 'Pale oak-look SPC flooring in a contemporary interior application',
    evidence: [['spc-construction-reference.webp', 'spc-construction-reference.webp']],
    authorityUrl: 'https://single-market-economy.ec.europa.eu/sectors/construction/construction-products-regulation-cpr/declaration-performance-and-ce-marking_en',
    authorityLabel: 'European Commission CPR guidance',
    authorityText: 'Product scope and intended use determine which declarations and performance evidence apply. Compare the exact SPC construction and destination-market requirement rather than treating a catalogue category as a test report.',
    topics: [['mixed-container-wall-panel-orders.html', 'Mixed-container planning'], ['wall-panel-export-packaging-checklist.html', 'Export packing checklist'], ['wall-panel-product-mix-by-project.html', 'Product mix by project'], ['wall-panel-standards-evidence-guide.html', 'Standards and evidence guide']],
    inbound: [['mixed-container-wall-panel-orders.html', 'wall-panel-export-packaging-checklist.html'], ['wall-panel-product-mix-by-project.html', 'mixed-container-wall-panel-orders.html']],
  },
  {
    file: 'pvc-wall-panels-humid-areas.html', release: 'v7-pvc-humid-areas',
    title: 'PVC Wall Panels for Humid Areas: Buyer Checklist | Luvie',
    cardTitle: 'PVC Wall Panels for Humid Areas: Buyer Checklist', category: 'Application planning',
    description: 'A B2B application checklist for PVC wall panels in moisture-aware interiors: confirm product, joints, substrate, installation conditions and market documents.',
    sourceImage: 'luvie-pvc-humid-interior-application-v2.webp', image: 'pvc-humid-interior-context.webp',
    imageAlt: 'Bright vanity-zone interior with broad white PVC wall panels and straight seams',
    authorityUrl: 'https://www.epa.gov/indoor-air-quality-iaq/moisture-control-guidance-building-design-construction-and-maintenance-0',
    authorityLabel: 'U.S. EPA moisture-control guidance',
    authorityText: 'Moisture performance belongs to the complete room and wall assembly. The panel face, joints, penetrations, substrate, plumbing and ventilation must be considered together.',
    topics: [['wall-panel-buyer-faq.html', 'Wall panel buyer FAQ'], ['pvc-ceiling-panels-vs-wall-panels.html', 'PVC ceiling panels vs wall panels'], ['wall-panel-standards-evidence-guide.html', 'Standards and evidence guide'], ['wall-panel-quality-inspection-guide.html', 'Wall panel quality inspection guide']],
    inbound: [],
  },
  {
    file: 'pvc-wall-panels-vs-ceramic-tile-importers.html', release: 'v7-pvc-vs-tile',
    title: 'PVC Wall Panels vs Ceramic Tile for Importers | Luvie',
    cardTitle: 'PVC Wall Panels vs Ceramic Tile for Importers', category: 'Material comparison',
    description: 'A B2B comparison for distributors: compare PVC wall panels and ceramic tile by installed scope, stocking, samples and project boundary.',
    sourceImage: 'luvie-pvc-vs-tile-decision-context-v1.webp', image: 'pvc-vs-tile-context.webp',
    imageAlt: 'Split interior comparison of straight-seamed PVC wall panels and ceramic tile',
    authorityUrl: 'https://www.epa.gov/indoor-air-quality-iaq/moisture-control-guidance-building-design-construction-and-maintenance-0',
    authorityLabel: 'U.S. EPA moisture-control guidance',
    authorityText: 'A finish comparison cannot replace assembly design. Substrate preparation, joints, penetrations, plumbing and ventilation remain part of moisture management.',
    topics: [['pvc-wall-panels-humid-areas.html', 'PVC panels in humid interiors'], ['pvc-ceiling-panels-vs-wall-panels.html', 'PVC ceiling panels vs wall panels'], ['wall-panel-standards-evidence-guide.html', 'Standards and evidence guide'], ['evaluate-wall-panel-samples.html', 'How to evaluate wall panel samples']],
    inbound: [['pvc-wall-panels-humid-areas.html', 'wall-panel-quality-inspection-guide.html'], ['wall-panel-buyer-faq.html', 'what-is-pvc-wall-panel.html']],
  },
  {
    file: 'pvc-ceiling-panel-supplier-checklist.html', release: 'v7-pvc-ceiling-supplier',
    title: 'PVC Ceiling Panel Supplier Checklist for a First Order | Luvie',
    cardTitle: 'PVC Ceiling Panel Supplier Checklist for a First Order', category: 'Supplier selection',
    description: 'Use this PVC ceiling panel supplier checklist to verify samples, SKU details, trims, packing, market documents and shipment evidence before a first order.',
    sourceImage: 'luvie-pvc-ceiling-installed-editorial-v5.webp', image: 'pvc-ceiling-installed-context.webp',
    imageAlt: 'White PVC ceiling panels with straight standard seams in a warm interior',
    authorityUrl: 'https://unece.org/transport/documents/standards/ctu-code',
    authorityLabel: 'IMO/ILO/UNECE CTU Code',
    authorityText: 'Packing and cargo securing must match the selected panel length, cartons, trims and container plan. A generic product image cannot verify shipment protection.',
    topics: [['pvc-ceiling-panels-vs-wall-panels.html', 'PVC ceiling panels vs wall panels'], ['wall-panel-export-packaging-checklist.html', 'Export packing checklist'], ['questions-to-ask-wall-panel-supplier.html', 'Questions to ask a panel supplier'], ['evaluate-wall-panel-samples.html', 'How to evaluate wall panel samples']],
    inbound: [['pvc-ceiling-panels-vs-wall-panels.html', 'what-is-pvc-wall-panel.html'], ['questions-to-ask-wall-panel-supplier.html', 'wall-panel-quality-inspection-guide.html']],
  },
  {
    file: 'three-tier-interior-finish-range-pvc-spc-decor.html', release: 'v7-interior-range',
    title: 'How Distributors Build a Sellable Interior Finish Range | Luvie',
    cardTitle: 'How Distributors Build a Sellable Interior Finish Range', category: 'Range strategy',
    description: 'A distributor planning guide: assign PVC panels, SPC flooring and decorative panels distinct selling roles before building an interior-finish range.',
    sourceImage: 'luvie-interior-range-material-library-v1.webp', image: 'interior-range-material-library.webp',
    imageAlt: 'Architectural PVC, SPC and decorative material surfaces arranged for range planning',
    authorityUrl: 'https://single-market-economy.ec.europa.eu/sectors/construction/construction-products-regulation-cpr/declaration-performance-and-ce-marking_en',
    authorityLabel: 'European Commission construction-product guidance',
    authorityText: 'Different product categories and intended uses require their own evidence path. Keep PVC panels, SPC flooring and decorative finishes in distinct specification and claim lanes.',
    topics: [['wall-panel-product-mix-by-project.html', 'Product mix by project'], ['mixed-container-wall-panel-orders.html', 'Mixed-container planning'], ['outdoor-wpc-decking-importer-checklist.html', 'Outdoor WPC importer checklist'], ['self-adhesive-grooved-wall-panel-buyer-guide.html', 'Decorative panel buyer guide']],
    inbound: [['wall-panel-product-mix-by-project.html', 'calculate-wall-panel-order-quantity.html'], ['mixed-container-wall-panel-orders.html', 'fob-vs-cif-wall-panel-orders.html']],
  },
];

const trackingSnippet = `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1331142262420820');fbq('track','PageView');</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VCLMP6Q5KJ');</script>`;

if (new Set(queue.map((entry) => entry.image)).size !== queue.length) throw new Error('Every queued article must use a unique hero image.');
if (!Number.isInteger(limit) || limit < 1) throw new Error('--limit must be a positive integer.');
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { lastPublished: '', releases: [] };
if (!dryRun && !force && state.lastPublished === today) {
  console.log(`Today's article is already published for ${today}.`);
  process.exit(0);
}
const isPublished = (entry) => existsSync(`articles/${entry.file}`) && readFileSync(`articles/${entry.file}`, 'utf8').includes(`<meta name="content-release" content="${entry.release}">`);
const pending = queue.filter((entry) => !isPublished(entry)).slice(0, limit);
if (!pending.length) { console.log('All approved articles are already published.'); process.exit(0); }

const sourceText = (file) => execFileSync('git', ['show', `${sourceBranch}:content-queue/articles/${file}`], { encoding: 'utf8' });
const sourceAsset = (file) => execFileSync('git', ['show', `${sourceBranch}:content-queue/assets/${file}`]);
const pageSchema = (entry) => JSON.stringify({ '@context': 'https://schema.org', '@graph': [
  { '@type': 'Organization', '@id': 'https://luvieindustry.com/#organization', name: 'Luvie Industry', legalName: 'Haining Luvie Import & Export Co., Ltd.', url: 'https://luvieindustry.com/', logo: 'https://luvieindustry.com/assets/brand/luvie-logo.webp', telephone: '+30 6947135317' },
  { '@type': 'Article', headline: entry.cardTitle, description: entry.description, datePublished: today, dateModified: today, image: `https://luvieindustry.com/assets/articles/${entry.image}`, author: { '@id': 'https://luvieindustry.com/#organization' }, publisher: { '@id': 'https://luvieindustry.com/#organization' }, mainEntityOfPage: `https://luvieindustry.com/articles/${entry.file}`, citation: [entry.authorityUrl] },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://luvieindustry.com/' }, { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://luvieindustry.com/articles/' }, { '@type': 'ListItem', position: 3, name: entry.cardTitle, item: `https://luvieindustry.com/articles/${entry.file}` }] },
] });

function prepare(entry) {
  let html = sourceText(entry.file)
    .replace(/<meta name="robots" content="[^"]+">/, '<meta name="robots" content="index, follow, max-image-preview:large">')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${entry.title}</title>`)
    .replace(/<meta name="description" content="[^"]+">/, `<meta name="description" content="${entry.description}">`)
    .replace(/<meta property="og:title" content="[^"]+">/, `<meta property="og:title" content="${entry.title}">`)
    .replace(/<meta property="og:description" content="[^"]+">/, `<meta property="og:description" content="${entry.description}">`)
    .replace(/<meta property="og:image" content="[^"]+">/, `<meta property="og:image" content="https://luvieindustry.com/assets/articles/${entry.image}">`)
    .replaceAll(`src="${entry.sourceImage}"`, `src="../assets/articles/${entry.image}"`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${pageSchema(entry)}</script>`)
    .replace(/<div class="related">[\s\S]*?<\/div>/, '')
    .replaceAll('rel="noopener noreferrer"', 'rel="noopener noreferrer external"')
    .replaceAll('rel="noopener"', 'rel="noopener external"')
    .replace(/href="request-samples\.html[^"]*"/g, `href="${whatsapp}"`);
  for (const [source, target] of entry.evidence ?? []) html = html.replaceAll(`src="evidence-assets/${source}"`, `src="../assets/articles/${target}"`);

  const metadata = `<meta name="author" content="Luvie Industry">\n<meta name="content-series" content="2026-v7">\n<meta name="content-release" content="${entry.release}">\n<meta property="article:published_time" content="${today}">\n<meta property="article:modified_time" content="${today}">`;
  html = html.replace(/(<meta name="description"[^>]+>)/, `$1\n${metadata}`);
  if (!html.includes('property="og:site_name"')) html = html.replace('<meta property="og:type" content="article">', '<meta property="og:type" content="article">\n<meta property="og:site_name" content="Luvie Industry">');
  if (!html.includes('name="twitter:title"')) html = html.replace('<meta name="twitter:card" content="summary_large_image">', `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${entry.title}">\n<meta name="twitter:description" content="${entry.description}">\n<meta name="twitter:image" content="https://luvieindustry.com/assets/articles/${entry.image}">`);
  if (!html.includes('apple-touch-icon')) html = html.replace('</head>', '<link rel="icon" type="image/png" sizes="32x32" href="../assets/brand/favicon-32.png">\n<link rel="apple-touch-icon" href="../assets/brand/apple-touch-icon.png">\n</head>');
  if (html.includes('luvie-b2b-article.css') && !html.includes('b2b-theme.css')) html = html.replace(/(<link rel="stylesheet" href="luvie-b2b-article\.css">)/, '$1\n<link rel="stylesheet" href="b2b-theme.css">');
  if (!html.includes('googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ')) html = html.replace('</head>', `${trackingSnippet}\n</head>`);
  const topicLinks = entry.topics.map(([file, label]) => `<a href="${file}">${label}</a>`).join('\n');
  const evidence = `<!-- topic-cluster-links:start -->\n<nav class="related" aria-label="Related buyer guides"><strong>Continue your research</strong><p>${topicLinks}</p></nav>\n<!-- topic-cluster-links:end -->\n<!-- authority-evidence:start -->\n<aside class="authority-evidence" aria-label="Independent evidence"><span>Independent evidence</span><p><a href="${entry.authorityUrl}" target="_blank" rel="noopener noreferrer external">${entry.authorityLabel}</a> provides the external context for this buyer check. ${entry.authorityText}</p></aside>\n<!-- authority-evidence:end -->`;
  html = html.replace(/<article class="article">/, `<article class="article">\n${evidence}`);
  html = html.replace('</head>', '<style>.article{min-width:0}.authority-evidence{margin:1.7rem 0;padding:20px 22px;border:1px solid #d9c7b8;background:#fffaf5}.authority-evidence span{display:block;color:#8e452e;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.authority-evidence p{margin:.5rem 0 0}.related a{margin-right:.75rem}</style>\n</head>');
  return html.replace(/[ \t]+$/gm, '');
}

function updateInbound(entry) {
  for (const [file, oldTarget] of entry.inbound) {
    const path = `articles/${file}`;
    let html = readFileSync(path, 'utf8');
    if (html.includes(`href="${entry.file}"`)) continue;
    const pattern = new RegExp(`<a href="${oldTarget.replaceAll('.', '\\.')}">[^<]+<\\/a>`);
    if (!pattern.test(html)) throw new Error(`${file} no longer links to expected replacement target ${oldTarget}`);
    html = html.replace(pattern, `<a href="${entry.file}">${entry.cardTitle}</a>`);
    writeFileSync(path, html);
  }
}

function updateSitemap(entry) {
  let sitemap = readFileSync('sitemap.xml', 'utf8');
  const loc = `https://luvieindustry.com/articles/${entry.file}`;
  const existing = new RegExp(`(<loc>${loc.replaceAll('.', '\\.')}<\\/loc>\\s*<lastmod>)[^<]+`);
  if (existing.test(sitemap)) sitemap = sitemap.replace(existing, `$1${today}`);
  else sitemap = sitemap.replace('</urlset>', `    <url>\n        <loc>${loc}</loc>\n        <lastmod>${today}</lastmod>\n        <priority>0.8</priority>\n    </url>\n</urlset>`);
  writeFileSync('sitemap.xml', sitemap);
}

for (const entry of pending) {
  if (dryRun) continue;
  mkdirSync('assets/articles', { recursive: true });
  writeFileSync(`assets/articles/${entry.image}`, sourceAsset(entry.image));
  for (const [source, target] of entry.evidence ?? []) writeFileSync(`assets/articles/${target}`, sourceAsset(source));
  writeFileSync(`articles/${entry.file}`, prepare(entry));
  updateInbound(entry);
  updateSitemap(entry);
  state.releases = [...new Set([...state.releases, entry.release])];
}
if (!dryRun) {
  execFileSync('node', ['scripts/build-resource-hub.mjs'], { stdio: 'inherit' });
  let index = readFileSync('articles/index.html', 'utf8');
  index = index.replace(/<meta name="last-modified" content="[^"]+">/, `<meta name="last-modified" content="${today}">`);
  writeFileSync('articles/index.html', index);
  state.lastPublished = today;
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}
console.log(`${dryRun ? 'Would publish' : 'Published'} ${pending.length} article(s):`);
for (const entry of pending) console.log(`- https://luvieindustry.com/articles/${entry.file} (${entry.image})`);
