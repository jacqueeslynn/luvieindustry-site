import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'articles', 'index.html');

const groups = [
  {
    id: 'start-here',
    eyebrow: 'Start here',
    title: 'Answers to the questions buyers ask first',
    files: [
      'wall-panel-buyer-faq.html',
      'wall-panel-standards-evidence-guide.html',
      'what-is-pvc-wall-panel.html',
      'pvc-wall-panel-vs-wpc-wall-panel.html',
    ],
  },
  {
    id: 'product-selection',
    eyebrow: 'Product selection',
    title: 'Choose the right material and specification',
    files: [
      'pvc-wall-panels-humid-areas.html',
      'outdoor-wpc-decking-importer-checklist.html',
      'self-adhesive-grooved-wall-panel-buyer-guide.html',
      'spc-flooring-distributor-spec-guide.html',
      'pvc-wall-panels-vs-ceramic-tile-importers.html',
      'fluted-wall-panels-distributor-guide.html',
      'pu-stone-panels-vs-natural-stone.html',
      'pvc-ceiling-panels-vs-wall-panels.html',
      'choose-pvc-wall-panel-thickness-profile.html',
    ],
  },
  {
    id: 'supplier-quality',
    eyebrow: 'Supplier and quality',
    title: 'Evaluate samples, suppliers and production quality',
    files: [
      'questions-to-ask-wall-panel-supplier.html',
      'pvc-ceiling-panel-supplier-checklist.html',
      'evaluate-wall-panel-samples.html',
      'wall-panel-showroom-display-guide.html',
      'wall-panel-quality-inspection-guide.html',
      'reduce-wall-panel-batch-color-differences.html',
      'luvie-order-process-inquiry-to-shipment.html',
    ],
  },
  {
    id: 'orders-logistics',
    eyebrow: 'Orders and logistics',
    title: 'Plan quantities, product mixes, branding and shipping',
    files: [
      'calculate-wall-panel-order-quantity.html',
      'wall-panel-product-mix-by-project.html',
      'three-tier-interior-finish-range-pvc-spc-decor.html',
      'mixed-container-wall-panel-orders.html',
      'wall-panel-export-packaging-checklist.html',
      'oem-private-label-wall-panels.html',
      'fob-vs-cif-wall-panel-orders.html',
    ],
  },
  {
    id: 'project-cases',
    eyebrow: 'Project cases',
    title: 'Turn product choices into complete room packages',
    files: [
      'hotel-corridor-fluted-wall-panel-case.html',
      'apartment-bedroom-feature-wall-case.html',
      'office-lobby-decorative-wall-panel-case.html',
    ],
  },
];

const cardTitles = {
  'wall-panel-buyer-faq.html': 'Are Wall Panels Waterproof? 15 Straight Answers for Buyers',
  'wall-panel-standards-evidence-guide.html': 'Wall Panel Standards: What Independent Evidence Actually Proves',
  'what-is-pvc-wall-panel.html': 'Are PVC Wall Panels Good? Uses, Limits and Buyer Checks',
  'pvc-wall-panel-vs-wpc-wall-panel.html': 'PVC vs WPC Wall Panels: Which Is Better for Your Market?',
  'pvc-wall-panels-humid-areas.html': 'Are PVC Wall Panels Waterproof in Bathrooms?',
  'outdoor-wpc-decking-importer-checklist.html': 'Outdoor WPC Decking: Importer Profile and System Checklist',
  'self-adhesive-grooved-wall-panel-buyer-guide.html': 'Gold-Grooved Self-Adhesive Wall Panels: Buyer Guide',
  'spc-flooring-distributor-spec-guide.html': 'SPC Flooring Specifications: Distributor Buyer Guide',
  'pvc-wall-panels-vs-ceramic-tile-importers.html': 'PVC Wall Panels vs Ceramic Tile for Importers',
  'fluted-wall-panels-distributor-guide.html': 'Fluted Wall Panels: Profiles, Uses and Buyer Guide',
  'pu-stone-panels-vs-natural-stone.html': 'PU Stone Panels vs Natural Stone: Which Should You Choose?',
  'pvc-ceiling-panels-vs-wall-panels.html': 'PVC Ceiling Panels vs Wall Panels: Key Differences',
  'choose-pvc-wall-panel-thickness-profile.html': 'PVC Wall Panel Thickness and Profiles: What to Check',
  'questions-to-ask-wall-panel-supplier.html': '10 Questions to Ask a Wall Panel Supplier Before Ordering',
  'pvc-ceiling-panel-supplier-checklist.html': 'PVC Ceiling Panel Supplier Checklist for a First Order',
  'evaluate-wall-panel-samples.html': 'Wall Panel Sample Checklist Before Mass Production',
  'wall-panel-showroom-display-guide.html': 'Wall Panel Showroom Display Guide for Distributors',
  'wall-panel-quality-inspection-guide.html': 'How to Check Wall Panel Quality Before a Bulk Order',
  'reduce-wall-panel-batch-color-differences.html': 'How to Prevent Wall Panel Color Differences Between Batches',
  'luvie-order-process-inquiry-to-shipment.html': 'Wall Panel Order Process: From Inquiry to Shipment',
  'calculate-wall-panel-order-quantity.html': 'How Many Wall Panels Do I Need? Order Calculation Guide',
  'wall-panel-product-mix-by-project.html': 'Best Wall Panel Mix for Hotels, Retail and Homes',
  'three-tier-interior-finish-range-pvc-spc-decor.html': 'How Distributors Build a Sellable Interior Finish Range',
  'mixed-container-wall-panel-orders.html': 'Mixed-Container Wall Panel Orders: A Buyer Planning Guide',
  'wall-panel-export-packaging-checklist.html': 'Wall Panel Packaging Checklist for Overseas Buyers',
  'oem-private-label-wall-panels.html': 'OEM Wall Panels: Private Label Checklist Before Production',
  'fob-vs-cif-wall-panel-orders.html': 'FOB vs CIF for Wall Panel Orders: Which Is Better?',
  'hotel-corridor-fluted-wall-panel-case.html': 'Hotel Corridor Wall Panels: Fluted Panel Project Guide',
  'apartment-bedroom-feature-wall-case.html': 'Bedroom Feature Wall Panels: Layout and Ordering Guide',
  'office-lobby-decorative-wall-panel-case.html': 'Office Lobby Wall Panels: Design and Project Buyer Guide',
};

const fallbackCards = {
  'wall-panel-standards-evidence-guide.html': `<a class="article-card" href="wall-panel-standards-evidence-guide.html">
                <img src="../assets/articles/wall-panel-buyer-guide-hero.webp" alt="Independent standards and evidence for PVC, WPC and decorative wall panels" loading="lazy">
                <div>
                    <span>Standards and evidence</span>
                    <h2>Wall Panel Standards: What Independent Evidence Actually Proves</h2>
                    <p>Use institutional sources to assess moisture, weathering, fire, VOCs, color, inspection, packing and trade terms.</p>
                </div>
            </a>`,
  'outdoor-wpc-decking-importer-checklist.html': `<a class="article-card" href="outdoor-wpc-decking-importer-checklist.html">
                <img src="../assets/articles/outdoor-wpc-decking-context.webp" alt="Outdoor WPC decking surface used for an importer profile and system checklist" loading="lazy">
                <div>
                    <span>Outdoor WPC · Published 15 September 2026</span>
                    <h2>Outdoor WPC Decking: Importer Profile and System Checklist</h2>
                    <p>Compare effective coverage, board profiles, accessories, installation boundaries and export packing before price.</p>
                </div>
            </a>`,
  'self-adhesive-grooved-wall-panel-buyer-guide.html': `<a class="article-card" href="self-adhesive-grooved-wall-panel-buyer-guide.html">
                <img src="../assets/articles/gold-leaf-grooved-panel-context.webp" alt="White marble-look decorative wall finish with fine gold groove details" loading="lazy">
                <div>
                    <span>Decorative panels · Published 16 September 2026</span>
                    <h2>Gold-Grooved Self-Adhesive Wall Panels: Buyer Guide</h2>
                    <p>Identify the product, review the physical finish, check the substrate and define the application boundary before sale.</p>
                </div>
            </a>`,
};

let source = fs.readFileSync(target, 'utf8');
const grid = source.match(/<section class="container article-grid"[^>]*>([\s\S]*?)<\/section>/);
if (!grid) throw new Error('Resource card grid not found.');

const cards = new Map();
for (const match of grid[1].matchAll(/<a class="article-card" href="([^"]+)">[\s\S]*?<\/a>/g)) {
  let card = match[0];
  const file = match[1];
  if (cardTitles[file]) {
    card = card.replace(/<h2>[\s\S]*?<\/h2>/, `<h2>${cardTitles[file]}</h2>`);
  }
  if (file === 'calculate-wall-panel-order-quantity.html') {
    card = card
      .replace('../assets/articles/wall-panel-buyer-guide-hero.webp', '../assets/articles/pvc-panel-profile.webp')
      .replace('Residential and commercial wall panel project scenes used for quantity planning', 'PVC wall panel profile and net coverage details used for quantity planning');
  }
  cards.set(file, card);
}

for (const [file, card] of Object.entries(fallbackCards)) {
  if (!cards.has(file)) cards.set(file, card);
}

for (const file of groups.flatMap((group) => group.files)) {
  if (cards.has(file)) continue;
  const articlePath = path.join(root, 'articles', file);
  if (!fs.existsSync(articlePath)) continue;
  const article = fs.readFileSync(articlePath, 'utf8');
  const description = article.match(/<meta name="description" content="([^"]+)">/)?.[1] ?? '';
  const image = article.match(/<meta property="og:image" content="https:\/\/luvieindustry\.com\/([^"]+)">/)?.[1] ?? '';
  const alt = article.match(/<img[^>]+alt="([^"]+)"/)?.[1] ?? cardTitles[file];
  const published = article.match(/<meta property="article:published_time" content="(\d{4}-\d{2}-\d{2})">/)?.[1] ?? '';
  const dateLabel = published ? ` · Published ${new Date(`${published}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}` : '';
  cards.set(file, `<a class="article-card" href="${file}">
                <img src="../${image}" alt="${alt}" loading="lazy">
                <div>
                    <span>Buyer guide${dateLabel}</span>
                    <h2>${cardTitles[file]}</h2>
                    <p>${description}</p>
                </div>
            </a>`);
}

const publishedGroups = groups.map((group) => ({ ...group, files: group.files.filter((file) => cards.has(file)) }));
const orderedFiles = publishedGroups.flatMap((group) => group.files);
if (cards.size !== orderedFiles.length) throw new Error(`Expected ${orderedFiles.length} cards, found ${cards.size}.`);

const groupedCards = publishedGroups.map((group) => `
            <div class="article-section-heading" id="${group.id}">
                <span>${group.eyebrow}</span>
                <h2>${group.title}</h2>
            </div>
            ${group.files.map((file) => cards.get(file)).join('\n            ')}`
).join('\n');

const nav = `<!-- resource-topic-nav:start -->
        <nav class="container resource-topic-nav" aria-label="Browse buyer guide topics">
            ${publishedGroups.map((group) => `<a href="#${group.id}">${group.eyebrow}</a>`).join('\n            ')}
        </nav>
        <!-- resource-topic-nav:end -->`;

source = source.replace(/<!-- resource-topic-nav:start -->[\s\S]*?<!-- resource-topic-nav:end -->\s*/, '');
source = source.replace(
  /(<section class="hero">[\s\S]*?<\/section>)/,
  `$1\n\n        ${nav}`,
);
source = source.replace(
  /<section class="container article-grid"[^>]*>[\s\S]*?<\/section>/,
  `<section class="container article-grid" aria-label="Luvie buying guides">${groupedCards}\n        </section>`,
);

source = source
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Wall Panel Buying Guides: PVC, WPC &amp; PU Stone | Luvie</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Compare PVC, WPC, PU stone and UV wall panels with practical guides on waterproofing, samples, quality, ordering, packaging and supplier selection.">')
  .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="Wall Panel Buying Guides: PVC, WPC &amp; PU Stone | Luvie">')
  .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Choose, inspect and order wall panel systems with practical guides for importers and distributors.">')
  .replace(/<meta property="og:image" content="[^"]*">/, '<meta property="og:image" content="https://luvieindustry.com/assets/articles/wall-panel-buyer-guide-hero.webp">')
  .replace(/<h1>[\s\S]*?<\/h1>/, '<h1>Wall Panel Buying Guides: Choose, Inspect and Order with Confidence</h1>')
  .replace(/<p class="lead">[\s\S]*?<\/p>/, '<p class="lead">Independent, practical answers for importers and distributors comparing materials, approving samples, planning orders and controlling wall panel quality.</p>');

if (!source.includes('name="twitter:title"')) {
  source = source.replace(
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="Wall Panel Buying Guides: PVC, WPC &amp; PU Stone | Luvie">\n    <meta name="twitter:description" content="Choose, inspect and order wall panel systems with practical guides for importers and distributors.">\n    <meta name="twitter:image" content="https://luvieindustry.com/assets/articles/wall-panel-buyer-guide-hero.webp">',
  );
}

source = source.replace(
  /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
  (full, open, jsonSource, close) => {
    const schema = JSON.parse(jsonSource);
    const graph = schema['@graph'];
    const organization = graph.find((item) => item['@type'] === 'Organization');
    Object.assign(organization, {
      legalName: 'Haining Luvie Import & Export Co., Ltd.',
      logo: 'https://luvieindustry.com/assets/brand/luvie-logo.webp',
    });
    const collection = graph.find((item) => item['@type'] === 'CollectionPage');
    Object.assign(collection, {
      name: 'Wall Panel Buying Guides: PVC, WPC and PU Stone',
      description: 'Practical wall panel selection, quality, ordering and project guides for importers and distributors.',
      dateModified: orderedFiles.reduce((latest, file) => {
        const article = fs.readFileSync(path.join(root, 'articles', file), 'utf8');
        const modified = article.match(/<meta property="article:modified_time" content="(\d{4}-\d{2}-\d{2})">/)?.[1] ?? '';
        return modified > latest ? modified : latest;
      }, '2026-09-16'),
    });
    const itemList = {
      '@type': 'ItemList',
      name: 'Luvie wall panel buyer guides',
      numberOfItems: orderedFiles.length,
      itemListElement: orderedFiles.map((file, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cardTitles[file],
        url: `https://luvieindustry.com/articles/${file}`,
      })),
    };
    const currentIndex = graph.findIndex((item) => item['@type'] === 'ItemList');
    if (currentIndex >= 0) graph[currentIndex] = itemList;
    else graph.push(itemList);
    return `${open}\n    ${JSON.stringify(schema, null, 4)}\n    ${close}`;
  },
);

fs.writeFileSync(target, source);
console.log(`Built topic-based resource hub with ${orderedFiles.length} guides.`);
