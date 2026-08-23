import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = path.join(root, 'articles');

const titles = {
  'apartment-bedroom-feature-wall-case.html': 'Apartment Bedroom Wall Panel Case | Luvie Industry',
  'calculate-wall-panel-order-quantity.html': 'How to Calculate Wall Panel Order Quantity | Luvie',
  'choose-pvc-wall-panel-thickness-profile.html': 'Choose PVC Wall Panel Thickness and Profile | Luvie',
  'evaluate-wall-panel-samples.html': 'How to Evaluate Wall Panel Samples | Luvie Industry',
  'fluted-wall-panels-distributor-guide.html': 'Fluted Wall Panel Product Guide for Distributors | Luvie',
  'fob-vs-cif-wall-panel-orders.html': 'FOB vs CIF Shipping for Wall Panel Orders | Luvie Industry',
  'hotel-corridor-fluted-wall-panel-case.html': 'Hotel Corridor Fluted Wall Panel Project Case | Luvie',
  'luvie-order-process-inquiry-to-shipment.html': 'Wall Panel Order Process: Inquiry to Shipment | Luvie',
  'mixed-container-wall-panel-orders.html': 'Mixed-Container Wall Panel Orders for Buyers | Luvie',
  'oem-private-label-wall-panels.html': 'OEM and Private-Label Wall Panels for Buyers | Luvie',
  'office-lobby-decorative-wall-panel-case.html': 'Office Lobby Decorative Wall Panel Project | Luvie',
  'pu-stone-panels-vs-natural-stone.html': 'PU Stone Panels vs Natural Stone Buyer Guide | Luvie',
  'pvc-ceiling-panels-vs-wall-panels.html': 'PVC Ceiling Panels vs Wall Panels | Luvie Industry',
  'pvc-wall-panel-vs-wpc-wall-panel.html': 'PVC vs WPC Wall Panels for Importers | Luvie Industry',
  'pvc-wall-panels-humid-areas.html': 'PVC Wall Panels for Humid Areas: Buyer Guide | Luvie',
  'questions-to-ask-wall-panel-supplier.html': '10 Questions for a Wall Panel Supplier | Luvie Industry',
  'reduce-wall-panel-batch-color-differences.html': 'Reduce Wall Panel Batch Color Differences Guide | Luvie',
  'wall-panel-export-packaging-checklist.html': 'Wall Panel Export Packaging Checklist for Buyers | Luvie',
  'wall-panel-product-mix-by-project.html': 'B2B Wall Panel Product Mix for Project Buyers | Luvie',
  'wall-panel-quality-inspection-guide.html': 'Wall Panel Quality Inspection Guide | Luvie Industry',
  'what-is-pvc-wall-panel.html': 'What Is a PVC Wall Panel? Guide for Importers | Luvie',
};

const descriptions = {
  'calculate-wall-panel-order-quantity.html': 'Calculate wall panel order quantity using net wall area, product coverage, cutting layout, waste allowance, accessories and packing units before purchasing.',
  'fluted-wall-panels-distributor-guide.html': 'A practical fluted wall panel guide for distributors covering profiles, finishes, accessories, target customers and product range planning for local markets.',
  'fob-vs-cif-wall-panel-orders.html': 'Compare FOB and CIF terms for wall panel orders, including freight, insurance, documents, landed-cost control and responsibilities for overseas buyers.',
  'luvie-order-process-inquiry-to-shipment.html': "Follow Luvie's wall panel order process from inquiry and sample approval through contract, production inspection, export documents and final shipment.",
  'mixed-container-wall-panel-orders.html': 'Learn how mixed-container wall panel orders help distributors test products, colors and price tiers while planning accessories, packing and stock risk.',
  'oem-private-label-wall-panels.html': 'Use this buyer checklist to confirm OEM wall panels, private-label cartons, product codes, artwork, samples and approvals before bulk production starts.',
  'pu-stone-panels-vs-natural-stone.html': 'Compare lightweight PU stone panels with natural stone by weight, installation, freight, substrate, application limits and sourcing questions for projects.',
  'pvc-wall-panels-humid-areas.html': 'Learn what importers should verify before specifying PVC wall panels for humid interiors, including substrate, joints, trims, sealant and installation.',
  'questions-to-ask-wall-panel-supplier.html': 'Ask wall panel suppliers these 10 practical questions about specifications, samples, quality control, packaging, production, export support and ordering.',
  'reduce-wall-panel-batch-color-differences.html': 'Reduce wall panel batch differences by confirming reference samples, color ranges, surface direction, production records, packing labels and order planning.',
  'wall-panel-export-packaging-checklist.html': 'Use this wall panel export packaging checklist to confirm cartons, labels, protection, pallet options, container loading and receiving requirements.',
  'wall-panel-product-mix-by-project.html': 'Plan a wall panel product mix for hotels, retail stores and homes using PVC, WPC, fluted panels, UV marble boards, PU stone and SPC flooring options.',
  'what-is-pvc-wall-panel.html': 'Learn where PVC wall panels work best, how they compare with tiles and WPC, and what importers should verify in samples, profiles, trims and bulk orders.',
};

const htmlAttr = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const htmlText = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function walk(value, visit) {
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit));
    return;
  }
  if (value && typeof value === 'object') {
    visit(value);
    Object.values(value).forEach((item) => walk(item, visit));
  }
}

function findObject(value, type) {
  let result;
  walk(value, (item) => {
    if (!result && item['@type'] === type) result = item;
  });
  return result;
}

function imageUrl(source) {
  const clean = source.replace(/^\.\.\//, '');
  return new URL(clean, 'https://luvieindustry.com/').href;
}

function updateSchema(source, canonical, heading) {
  return source.replace(
    /(<script\s+type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
    (full, open, jsonSource, close) => {
      const schema = JSON.parse(jsonSource);
      const breadcrumb = findObject(schema, 'BreadcrumbList');

      walk(schema, (item) => {
        if (item['@type'] !== 'Organization') return;
        item['@id'] ??= 'https://luvieindustry.com/#organization';
        item.name ??= 'Luvie Industry';
        item.legalName ??= 'Haining Luvie Import & Export Co., Ltd.';
        item.url ??= 'https://luvieindustry.com/';
        item.logo ??= 'https://luvieindustry.com/assets/brand/luvie-logo.webp';
        item.telephone ??= '+30 6947135317';
      });

      if (!breadcrumb) {
        const breadcrumbData = {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://luvieindustry.com/'},
            {'@type': 'ListItem', position: 2, name: 'Resources', item: 'https://luvieindustry.com/articles/'},
            {'@type': 'ListItem', position: 3, name: heading, item: canonical},
          ],
        };

        if (Array.isArray(schema['@graph'])) {
          schema['@graph'].push(breadcrumbData);
        } else {
          const context = schema['@context'] ?? 'https://schema.org';
          const original = {...schema};
          delete original['@context'];
          Object.keys(schema).forEach((key) => delete schema[key]);
          schema['@context'] = context;
          schema['@graph'] = [original, breadcrumbData];
        }
      }

      if (Array.isArray(schema['@graph'])) {
        delete schema.author;
        delete schema.publisher;
      }

      const finalArticle = findObject(schema, 'Article');
      if (finalArticle) {
        finalArticle.author ??= {'@id': 'https://luvieindustry.com/#organization'};
        finalArticle.publisher ??= {'@id': 'https://luvieindustry.com/#organization'};
      }

      return `${open}\n${JSON.stringify(schema, null, 4)}\n${close}`;
    },
  );
}

function updateArticle(file) {
  const filePath = path.join(articlesDir, file);
  let source = fs.readFileSync(filePath, 'utf8');
  const title = titles[file];

  source = source.replace(/<title>[\s\S]*?<\/title>/, `<title>${htmlText(title)}</title>`);

  const currentDescription = source.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/)?.[1];
  const description = descriptions[file] ?? currentDescription;
  if (!description) throw new Error(`Missing description in ${file}`);
  source = source.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${htmlAttr(description)}">`,
  );

  const canonical = source.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>/)?.[1];
  const heading = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim();
  const rawImage = source.match(/<img[^>]+src="([^"]+)"/)?.[1];
  if (!canonical || !heading || !rawImage) throw new Error(`Missing SEO source field in ${file}`);

  const schemaMatch = source.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const schema = JSON.parse(schemaMatch[1]);
  const article = findObject(schema, 'Article');
  const dates = [
    article?.datePublished ? `<meta property="article:published_time" content="${htmlAttr(article.datePublished)}">` : '',
    article?.dateModified ? `<meta property="article:modified_time" content="${htmlAttr(article.dateModified)}">` : '',
  ].filter(Boolean).join('\n');

  const block = `<!-- SEO social metadata -->
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Luvie Industry">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Luvie Industry">
<meta property="og:title" content="${htmlAttr(title)}">
<meta property="og:description" content="${htmlAttr(description)}">
<meta property="og:url" content="${htmlAttr(canonical)}">
<meta property="og:image" content="${htmlAttr(imageUrl(rawImage))}">
${dates}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${htmlAttr(title)}">
<meta name="twitter:description" content="${htmlAttr(description)}">
<meta name="twitter:image" content="${htmlAttr(imageUrl(rawImage))}">
<!-- /SEO social metadata -->`;

  if (source.includes('<!-- SEO social metadata -->')) {
    source = source.replace(/<!-- SEO social metadata -->[\s\S]*?<!-- \/SEO social metadata -->/, block);
  } else {
    source = source.replace(
      /(<link\s+rel="canonical"\s+href="[^"]+"\s*\/?>)/,
      `$1\n${block}`,
    );
  }

  if (!source.includes('class="article-byline"') && !source.includes('By Luvie Industry')) {
    source = source.replace(
      /(<h1[^>]*>)/,
      '<p class="article-byline">By Luvie Industry · Buyer resource</p>\n$1',
    );
  }

  if ((source.match(/By Luvie Industry/g) ?? []).length > 1) {
    source = source.replace(/<p class="article-byline">By Luvie Industry · Buyer resource<\/p>/, '');
  }
  source = source.replace(
    /(<p class="article-byline">By Luvie Industry · Buyer resource<\/p>)\s*(<h1)/,
    '$1\n$2',
  );
  source = source.replace(/[ \t]+$/gm, '');

  source = updateSchema(source, canonical, heading);
  fs.writeFileSync(filePath, source);
}

for (const file of Object.keys(titles)) updateArticle(file);
console.log(`Updated SEO metadata for ${Object.keys(titles).length} buyer articles.`);
