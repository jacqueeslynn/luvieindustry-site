import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = path.join(root, 'articles');
const modifiedDate = '2026-08-24';

const titles = {
  'apartment-bedroom-feature-wall-case.html': 'Bedroom Feature Wall Panels: Layout & Ordering Guide',
  'calculate-wall-panel-order-quantity.html': 'How Many Wall Panels Do I Need? Order Calculator Guide',
  'choose-pvc-wall-panel-thickness-profile.html': 'PVC Wall Panel Thickness & Profile: Buyer Guide | Luvie',
  'evaluate-wall-panel-samples.html': 'Wall Panel Sample Checklist Before Mass Production | Luvie',
  'fluted-wall-panels-distributor-guide.html': 'Fluted Wall Panels: Profiles, Uses & Buyer Guide | Luvie',
  'fob-vs-cif-wall-panel-orders.html': 'FOB vs CIF for Wall Panel Orders: Which Is Better? | Luvie',
  'hotel-corridor-fluted-wall-panel-case.html': 'Hotel Corridor Wall Panels: Fluted Panel Project Guide',
  'luvie-order-process-inquiry-to-shipment.html': 'Wall Panel Order Process: Inquiry, Samples & Shipment',
  'mixed-container-wall-panel-orders.html': 'Mixed-Container Wall Panel Orders: Buyer Planning Guide',
  'oem-private-label-wall-panels.html': 'OEM Wall Panels: Private Label Checklist Before Production',
  'office-lobby-decorative-wall-panel-case.html': 'Office Lobby Wall Panels: Design & Project Buyer Guide',
  'pu-stone-panels-vs-natural-stone.html': 'PU Stone Panels vs Natural Stone: Which Should You Choose?',
  'pvc-ceiling-panels-vs-wall-panels.html': 'PVC Ceiling Panels vs Wall Panels: Key Differences | Luvie',
  'pvc-wall-panel-vs-wpc-wall-panel.html': 'PVC vs WPC Wall Panels: Which Is Better? | Luvie',
  'pvc-wall-panels-humid-areas.html': 'Are PVC Wall Panels Waterproof? Bathroom Buyer Guide',
  'questions-to-ask-wall-panel-supplier.html': '10 Questions to Ask a Wall Panel Supplier Before Ordering',
  'reduce-wall-panel-batch-color-differences.html': 'How to Prevent Wall Panel Color Differences Between Batches',
  'wall-panel-export-packaging-checklist.html': 'Wall Panel Packaging Checklist for Overseas Buyers | Luvie',
  'wall-panel-product-mix-by-project.html': 'Best Wall Panel Mix for Hotels, Retail & Residential',
  'wall-panel-quality-inspection-guide.html': 'How to Check Wall Panel Quality Before Bulk Orders | Luvie',
  'wall-panel-buyer-faq.html': 'Are Wall Panels Waterproof? PVC, WPC & PU Stone FAQ',
  'what-is-pvc-wall-panel.html': 'Are PVC Wall Panels Good? Uses, Pros & Buyer Checks | Luvie',
};

const descriptions = {
  'apartment-bedroom-feature-wall-case.html': 'Plan bedroom feature wall panels around bed alignment, lighting, sockets, trims, samples, panel direction, cutting layout and room-based order quantities.',
  'calculate-wall-panel-order-quantity.html': 'Learn how many wall panels you need using net coverage, wall dimensions, openings, cutting layout, pattern direction, packing units and project allowance.',
  'choose-pvc-wall-panel-thickness-profile.html': 'Choose PVC wall panel thickness and profiles by application, net coverage, joint design, surface, accessories, packing and local customer expectations.',
  'evaluate-wall-panel-samples.html': 'Evaluate wall panel samples with a practical checklist for color, texture, profile, joints, trims, installation, packing and mass-production approval.',
  'fluted-wall-panels-distributor-guide.html': 'Compare fluted wall panel profiles, finishes, accessories and applications, then build a focused product range for distributors, showrooms and projects.',
  'fob-vs-cif-wall-panel-orders.html': 'Compare FOB and CIF for wall panel orders, including freight control, insurance, documents, landed-cost visibility and buyer-supplier responsibilities.',
  'hotel-corridor-fluted-wall-panel-case.html': 'Plan hotel corridor wall panels with clear feature zones, fluted profiles, finishes, trims, lighting, batch control, room-based packing and replacement stock.',
  'luvie-order-process-inquiry-to-shipment.html': 'Follow the wall panel order process from inquiry and product confirmation through samples, contract, production inspection, documents and shipment.',
  'mixed-container-wall-panel-orders.html': 'Plan a mixed-container wall panel order that tests products, colors and price tiers while controlling accessories, packing, loading and initial stock risk.',
  'oem-private-label-wall-panels.html': 'Prepare an OEM wall panel order with a private-label checklist for artwork, product codes, samples, cartons, approvals and responsibilities before production.',
  'office-lobby-decorative-wall-panel-case.html': 'Plan office lobby wall panels around the focal wall, signage, lighting, durability, samples, access panels, packing and project installation requirements.',
  'pu-stone-panels-vs-natural-stone.html': 'Compare PU stone panels with natural stone by weight, appearance, installation, exterior exposure, packing and project requirements before sourcing.',
  'pvc-ceiling-panels-vs-wall-panels.html': 'Compare PVC ceiling panels and wall panels by profile, support, finish, joints, accessories and application before selecting products for your market.',
  'pvc-wall-panel-vs-wpc-wall-panel.html': 'Compare PVC and WPC wall panels by application, moisture exposure, profile, finish, installation and market positioning before selecting your product range.',
  'pvc-wall-panels-humid-areas.html': 'Are PVC wall panels waterproof? Learn what bathroom and humid-area buyers must verify about joints, trims, substrate, sealant and installation conditions.',
  'questions-to-ask-wall-panel-supplier.html': 'Ask these 10 questions before choosing a wall panel supplier, covering exact specifications, samples, quality control, packing, documents and order terms.',
  'reduce-wall-panel-batch-color-differences.html': 'Prevent wall panel batch color differences with approved samples, range limits, production records, surface direction, labels and repeat-order controls.',
  'wall-panel-export-packaging-checklist.html': 'Use this export wall panel packaging checklist to verify cartons, labels, surface protection, pallets, loading records and receiving requirements.',
  'wall-panel-product-mix-by-project.html': 'Choose the right wall panel mix for hotels, retail stores and homes using PVC, WPC, fluted panels, PU stone, UV boards, SPC flooring and accessories.',
  'wall-panel-quality-inspection-guide.html': 'Use this wall panel quality checklist to verify approved samples, color, surface, dimensions, joint fit, packing and pre-shipment records before a bulk order.',
  'wall-panel-buyer-faq.html': 'Get direct answers to common buyer questions about PVC, WPC, PU stone and UV wall panels, from waterproofing and bathrooms to outdoor use and sourcing.',
  'what-is-pvc-wall-panel.html': 'Learn where PVC wall panels work, their practical advantages and limits, and what importers should check in profiles, trims, samples and bulk orders.',
};

const headlines = {
  'apartment-bedroom-feature-wall-case.html': 'Bedroom Feature Wall Panels: Layout, Lighting and Ordering',
  'calculate-wall-panel-order-quantity.html': 'How Many Wall Panels Do I Need? A Practical Order Guide',
  'choose-pvc-wall-panel-thickness-profile.html': 'PVC Wall Panel Thickness and Profiles: What Buyers Should Check',
  'evaluate-wall-panel-samples.html': 'Wall Panel Sample Checklist Before Mass Production',
  'fluted-wall-panels-distributor-guide.html': 'Fluted Wall Panels: Profiles, Uses and Distributor Buying Guide',
  'fob-vs-cif-wall-panel-orders.html': 'FOB vs CIF for Wall Panel Orders: Which Is Better for Buyers?',
  'hotel-corridor-fluted-wall-panel-case.html': 'Hotel Corridor Wall Panels: Fluted Panel Project Guide',
  'luvie-order-process-inquiry-to-shipment.html': 'Wall Panel Order Process: From Inquiry and Samples to Shipment',
  'mixed-container-wall-panel-orders.html': 'Mixed-Container Wall Panel Orders: A Buyer Planning Guide',
  'oem-private-label-wall-panels.html': 'OEM Wall Panels: Private Label Checklist Before Production',
  'office-lobby-decorative-wall-panel-case.html': 'Office Lobby Wall Panels: Design and Project Buyer Guide',
  'pu-stone-panels-vs-natural-stone.html': 'PU Stone Panels vs Natural Stone: Which Should You Choose?',
  'pvc-ceiling-panels-vs-wall-panels.html': 'PVC Ceiling Panels vs Wall Panels: Key Differences for Buyers',
  'pvc-wall-panel-vs-wpc-wall-panel.html': 'PVC vs WPC Wall Panels: Which Is Better for Your Market?',
  'pvc-wall-panels-humid-areas.html': 'Are PVC Wall Panels Waterproof? Bathroom and Humid-Area Guide',
  'questions-to-ask-wall-panel-supplier.html': '10 Questions to Ask a Wall Panel Supplier Before Ordering',
  'reduce-wall-panel-batch-color-differences.html': 'How to Prevent Wall Panel Color Differences Between Batches',
  'wall-panel-export-packaging-checklist.html': 'Wall Panel Packaging Checklist for Overseas Buyers',
  'wall-panel-product-mix-by-project.html': 'Best Wall Panel Mix for Hotels, Retail and Residential Projects',
  'wall-panel-quality-inspection-guide.html': 'How to Check Wall Panel Quality Before a Bulk Order',
  'wall-panel-buyer-faq.html': 'Are Wall Panels Waterproof? PVC, WPC, PU Stone and UV Board Answers',
  'what-is-pvc-wall-panel.html': 'Are PVC Wall Panels Good? Uses, Limits and Buyer Checks',
};

const topicLinks = {
  'wall-panel-buyer-faq.html': ['what-is-pvc-wall-panel.html', 'pvc-wall-panel-vs-wpc-wall-panel.html', 'pu-stone-panels-vs-natural-stone.html', 'questions-to-ask-wall-panel-supplier.html'],
  'what-is-pvc-wall-panel.html': ['wall-panel-buyer-faq.html', 'pvc-wall-panel-vs-wpc-wall-panel.html', 'pvc-wall-panels-humid-areas.html', 'pvc-ceiling-panels-vs-wall-panels.html'],
  'pvc-wall-panel-vs-wpc-wall-panel.html': ['what-is-pvc-wall-panel.html', 'pvc-wall-panels-humid-areas.html', 'fluted-wall-panels-distributor-guide.html', 'pvc-ceiling-panels-vs-wall-panels.html'],
  'pvc-wall-panels-humid-areas.html': ['wall-panel-buyer-faq.html', 'pvc-ceiling-panels-vs-wall-panels.html', 'wall-panel-quality-inspection-guide.html', 'pu-stone-panels-vs-natural-stone.html'],
  'pvc-ceiling-panels-vs-wall-panels.html': ['what-is-pvc-wall-panel.html', 'choose-pvc-wall-panel-thickness-profile.html', 'pvc-wall-panels-humid-areas.html', 'wall-panel-buyer-faq.html'],
  'choose-pvc-wall-panel-thickness-profile.html': ['what-is-pvc-wall-panel.html', 'evaluate-wall-panel-samples.html', 'calculate-wall-panel-order-quantity.html', 'apartment-bedroom-feature-wall-case.html'],
  'fluted-wall-panels-distributor-guide.html': ['pvc-wall-panel-vs-wpc-wall-panel.html', 'evaluate-wall-panel-samples.html', 'hotel-corridor-fluted-wall-panel-case.html', 'reduce-wall-panel-batch-color-differences.html'],
  'pu-stone-panels-vs-natural-stone.html': ['wall-panel-buyer-faq.html', 'wall-panel-product-mix-by-project.html', 'mixed-container-wall-panel-orders.html', 'wall-panel-export-packaging-checklist.html'],
  'questions-to-ask-wall-panel-supplier.html': ['wall-panel-quality-inspection-guide.html', 'evaluate-wall-panel-samples.html', 'luvie-order-process-inquiry-to-shipment.html', 'oem-private-label-wall-panels.html'],
  'evaluate-wall-panel-samples.html': ['wall-panel-quality-inspection-guide.html', 'questions-to-ask-wall-panel-supplier.html', 'reduce-wall-panel-batch-color-differences.html', 'apartment-bedroom-feature-wall-case.html'],
  'wall-panel-quality-inspection-guide.html': ['evaluate-wall-panel-samples.html', 'questions-to-ask-wall-panel-supplier.html', 'office-lobby-decorative-wall-panel-case.html', 'reduce-wall-panel-batch-color-differences.html'],
  'reduce-wall-panel-batch-color-differences.html': ['evaluate-wall-panel-samples.html', 'wall-panel-quality-inspection-guide.html', 'hotel-corridor-fluted-wall-panel-case.html', 'oem-private-label-wall-panels.html'],
  'luvie-order-process-inquiry-to-shipment.html': ['questions-to-ask-wall-panel-supplier.html', 'wall-panel-export-packaging-checklist.html', 'fob-vs-cif-wall-panel-orders.html', 'oem-private-label-wall-panels.html'],
  'calculate-wall-panel-order-quantity.html': ['choose-pvc-wall-panel-thickness-profile.html', 'wall-panel-product-mix-by-project.html', 'apartment-bedroom-feature-wall-case.html', 'wall-panel-export-packaging-checklist.html'],
  'wall-panel-product-mix-by-project.html': ['calculate-wall-panel-order-quantity.html', 'mixed-container-wall-panel-orders.html', 'office-lobby-decorative-wall-panel-case.html', 'pu-stone-panels-vs-natural-stone.html'],
  'mixed-container-wall-panel-orders.html': ['wall-panel-product-mix-by-project.html', 'wall-panel-export-packaging-checklist.html', 'fob-vs-cif-wall-panel-orders.html', 'pu-stone-panels-vs-natural-stone.html'],
  'wall-panel-export-packaging-checklist.html': ['mixed-container-wall-panel-orders.html', 'oem-private-label-wall-panels.html', 'fob-vs-cif-wall-panel-orders.html', 'wall-panel-quality-inspection-guide.html'],
  'oem-private-label-wall-panels.html': ['questions-to-ask-wall-panel-supplier.html', 'wall-panel-export-packaging-checklist.html', 'luvie-order-process-inquiry-to-shipment.html', 'fob-vs-cif-wall-panel-orders.html'],
  'fob-vs-cif-wall-panel-orders.html': ['wall-panel-export-packaging-checklist.html', 'mixed-container-wall-panel-orders.html', 'luvie-order-process-inquiry-to-shipment.html', 'oem-private-label-wall-panels.html'],
  'hotel-corridor-fluted-wall-panel-case.html': ['fluted-wall-panels-distributor-guide.html', 'wall-panel-product-mix-by-project.html', 'calculate-wall-panel-order-quantity.html', 'reduce-wall-panel-batch-color-differences.html'],
  'apartment-bedroom-feature-wall-case.html': ['wall-panel-product-mix-by-project.html', 'choose-pvc-wall-panel-thickness-profile.html', 'evaluate-wall-panel-samples.html', 'pvc-ceiling-panels-vs-wall-panels.html'],
  'office-lobby-decorative-wall-panel-case.html': ['wall-panel-product-mix-by-project.html', 'wall-panel-quality-inspection-guide.html', 'evaluate-wall-panel-samples.html', 'questions-to-ask-wall-panel-supplier.html'],
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

function updateSchema(source, canonical, heading, description, image) {
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
      } else if (Array.isArray(breadcrumb.itemListElement)) {
        const currentPage = breadcrumb.itemListElement.at(-1);
        if (currentPage?.position === 3) {
          currentPage.name = heading;
          currentPage.item = canonical;
        }
      }

      if (Array.isArray(schema['@graph'])) {
        delete schema.author;
        delete schema.publisher;
      }

      const finalArticle = findObject(schema, 'Article');
      if (finalArticle) {
        finalArticle.headline = heading;
        finalArticle.description = description;
        finalArticle.image = image;
        finalArticle.dateModified = modifiedDate;
        finalArticle.mainEntityOfPage = canonical;
        finalArticle.author = {'@id': 'https://luvieindustry.com/#organization'};
        finalArticle.publisher = {'@id': 'https://luvieindustry.com/#organization'};
      }

      return `${open}\n${JSON.stringify(schema, null, 4)}\n${close}`;
    },
  );
}

function buildTopicBlock(file) {
  const links = topicLinks[file];
  if (!links?.length) throw new Error(`Missing topic links in ${file}`);

  const items = links.map((target) => {
    const label = headlines[target];
    if (!label) throw new Error(`Missing topic-link headline for ${target}`);
    return `<a href="${target}">${htmlText(label)}</a>`;
  }).join('\n');

  return `<!-- topic-cluster-links:start -->
<nav class="article-path" aria-label="Related wall panel buying guides">
  <span>Continue your research</span>
  <div class="article-path__links">
${items}
  </div>
</nav>
<!-- topic-cluster-links:end -->`;
}

function updateArticle(file) {
  const filePath = path.join(articlesDir, file);
  let source = fs.readFileSync(filePath, 'utf8');
  const title = titles[file];

  source = source.replace(/<!-- SEO social metadata -->[\s\S]*?<!-- \/SEO social metadata -->\s*/, '');
  source = source.replace(
    /^[ \t]*<meta\s+(?:name="(?:robots|author|twitter:(?:card|title|description|image))"|property="(?:og:(?:type|site_name|title|description|url|image)|article:(?:published_time|modified_time))")\s+content="[^"]*"\s*\/?>\s*$/gm,
    '',
  );

  source = source.replace(/<title>[\s\S]*?<\/title>/, `<title>${htmlText(title)}</title>`);

  const currentDescription = source.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/)?.[1];
  const description = descriptions[file] ?? currentDescription;
  if (!description) throw new Error(`Missing description in ${file}`);
  source = source.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${htmlAttr(description)}">`,
  );

  const headline = headlines[file];
  if (!headline) throw new Error(`Missing headline in ${file}`);
  source = source.replace(
    /(<h1\b[^>]*>)[\s\S]*?(<\/h1>)/,
    `$1${htmlText(headline)}$2`,
  );

  const canonical = source.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>/)?.[1];
  const heading = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim();
  const rawImage = source.match(/<img[^>]+src="([^"]+)"/)?.[1];
  if (!canonical || !heading || !rawImage) throw new Error(`Missing SEO source field in ${file}`);
  const absoluteImage = imageUrl(rawImage);

  const schemaMatch = source.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const schema = JSON.parse(schemaMatch[1]);
  const article = findObject(schema, 'Article');
  const dates = [
    article?.datePublished ? `<meta property="article:published_time" content="${htmlAttr(article.datePublished)}">` : '',
    `<meta property="article:modified_time" content="${modifiedDate}">`,
  ].filter(Boolean).join('\n');

  const block = `<!-- SEO social metadata -->
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Luvie Industry">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Luvie Industry">
<meta property="og:title" content="${htmlAttr(title)}">
<meta property="og:description" content="${htmlAttr(description)}">
<meta property="og:url" content="${htmlAttr(canonical)}">
<meta property="og:image" content="${htmlAttr(absoluteImage)}">
${dates}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${htmlAttr(title)}">
<meta name="twitter:description" content="${htmlAttr(description)}">
<meta name="twitter:image" content="${htmlAttr(absoluteImage)}">
<!-- /SEO social metadata -->`;

  source = source.replace(
    /(<link\s+rel="canonical"\s+href="[^"]+"\s*\/?>)/,
    `$1\n${block}`,
  );

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

  source = source.replace(
    /((?:Reviewed|Updated)\s*<time datetime=")[^"]+(">)[^<]+/,
    `$1${modifiedDate}$2${modifiedDate}`,
  );

  source = source.replace(
    /<!-- topic-cluster-links:start -->[\s\S]*?<!-- topic-cluster-links:end -->\s*/,
    '',
  );
  const topicBlock = buildTopicBlock(file);
  if (source.includes('</figure>')) {
    source = source.replace('</figure>', `</figure>\n${topicBlock}`);
  } else {
    source = source.replace(/(<p class="lead">[\s\S]*?<\/p>)/, `$1\n${topicBlock}`);
  }
  source = source.replace(/[ \t]+$/gm, '');

  source = updateSchema(source, canonical, heading, description, absoluteImage);
  fs.writeFileSync(filePath, source);
}

for (const file of Object.keys(titles)) updateArticle(file);

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
for (const file of Object.keys(titles)) {
  const url = `https://luvieindustry.com/articles/${file}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  sitemap = sitemap.replace(
    new RegExp(`(<loc>${url}<\\/loc>\\s*<lastmod>)[^<]+(<\\/lastmod>)`),
    `$1${modifiedDate}$2`,
  );
}
fs.writeFileSync(sitemapPath, sitemap);
console.log(`Updated SEO metadata for ${Object.keys(titles).length} buyer articles.`);
