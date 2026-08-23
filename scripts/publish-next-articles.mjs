import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const sourceBranch = "origin/feature/seo-geo-content";
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number.parseInt(limitArg.replace("--limit=", ""), 10) : 2;
const today = new Date().toISOString().slice(0, 10);
const queue = [
  ["questions-to-ask-wall-panel-supplier.html", "Supplier selection", "10 Questions to Ask a Wall Panel Supplier Before Ordering", "Compare suppliers using the same questions about specifications, samples, quality, packing, lead time and export support."],
  ["evaluate-wall-panel-samples.html", "Sample approval", "How to Evaluate Wall Panel Samples Before Mass Production", "Use a repeatable sample checklist before approving wall panel specifications, color, surface, profile and packing."],
  ["pvc-wall-panels-humid-areas.html", "Application planning", "PVC Wall Panels for Humid Areas: What Buyers Should Verify", "Understand the product, joint, substrate and installation questions that matter in humid applications."],
  ["fluted-wall-panels-distributor-guide.html", "Distributor guide", "Fluted Wall Panels: A Product Guide for Distributors", "Plan profiles, finishes, accessories and market positioning for a practical fluted wall panel range."],
  ["pu-stone-panels-vs-natural-stone.html", "Material comparison", "PU Stone Panels vs Natural Stone", "Compare weight, installation, transport and sourcing considerations before selecting a stone-look wall system."],
  ["mixed-container-wall-panel-orders.html", "Order planning", "How Mixed-Container Orders Help Distributors Test a Market", "Learn how a coordinated product mix can reduce first-order risk and test demand across wall panel categories."],
  ["wall-panel-export-packaging-checklist.html", "Export packing", "Wall Panel Export Packaging Checklist", "Check cartons, labels, protection, quantities, loading records and shipping marks before dispatch."],
  ["oem-private-label-wall-panels.html", "OEM and branding", "OEM and Private-Label Wall Panels", "Confirm artwork, labels, cartons, samples, quantities and approval responsibilities before production."],
  ["fob-vs-cif-wall-panel-orders.html", "Trade terms", "FOB vs CIF for Wall Panel Orders", "A practical comparison of cost responsibility, freight control and documents for overseas wall panel buyers."],
  ["reduce-wall-panel-batch-color-differences.html", "Quality control", "How to Reduce Wall Panel Batch Color Differences", "Build color standards, approved samples and batch records into repeat wall panel orders."],
  ["wall-panel-product-mix-by-project.html", "Project planning", "Wall Panel Product Mix by Project", "Match wall panels, floors and accessories to hotel, retail and residential project requirements."],
  ["luvie-order-process-inquiry-to-shipment.html", "Working with Luvie", "From Inquiry to Shipment: Luvie's Five-Step Order Process", "See how product confirmation, samples, contracts, production inspection and shipping fit together."]
];
const visuals = {
  "questions-to-ask-wall-panel-supplier.html": ["../assets/articles/luvie-factory.webp", "Luvie wall panel manufacturing facility for supplier evaluation"],
  "evaluate-wall-panel-samples.html": ["../assets/articles/pvc-panel-texture.webp", "PVC wall panel texture and surface sample details"],
  "pvc-wall-panels-humid-areas.html": ["../assets/articles/pvc-humid-area.webp", "PVC wall panels in a humid bathroom application visualization"],
  "fluted-wall-panels-distributor-guide.html": ["../assets/articles/fluted-panel-installation.webp", "Fluted decorative wall panel installation visualization"],
  "pu-stone-panels-vs-natural-stone.html": ["../assets/catalogs/covers/pu-stone-panel.jpg", "PU stone wall panel product collection"],
  "mixed-container-wall-panel-orders.html": ["../assets/articles/export-packaging.webp", "Packaged wall panel products prepared for export"],
  "wall-panel-export-packaging-checklist.html": ["../assets/articles/export-packaging.webp", "Export wall panel packaging and warehouse preparation"],
  "oem-private-label-wall-panels.html": ["../assets/articles/pvc-panel-profile.webp", "Wall panel profile and surface options for private label programs"],
  "fob-vs-cif-wall-panel-orders.html": ["../assets/articles/export-packaging.webp", "Wall panel cargo prepared for international shipping"],
  "reduce-wall-panel-batch-color-differences.html": ["../assets/articles/pvc-panel-texture.webp", "PVC wall panel surface and color sample comparison"],
  "wall-panel-product-mix-by-project.html": ["../assets/articles/wall-panel-buyer-guide-hero.webp", "Wall panel application scenes for residential and commercial projects"],
  "luvie-order-process-inquiry-to-shipment.html": ["../assets/articles/luvie-factory.webp", "Luvie factory supporting wall panel production and export orders"]
};

const trackingSnippet = `<script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1331142262420820');
        fbq('track', 'PageView');
    </script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-VCLMP6Q5KJ');
    </script>`;

function ensureTracking(html) {
  if (html.includes("googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ")) return html;
  return html.replace("</head>", `${trackingSnippet}</head>`);
}

let index = readFileSync("articles/index.html", "utf8");
const existingLastModified = [...index.matchAll(/<meta name="last-modified" content="(\d{4}-\d{2}-\d{2})">/g)]
  .map((match) => match[1]);

if (!Number.isInteger(limit) || limit < 1) {
  throw new Error("--limit must be a positive integer.");
}

if (!dryRun && !force && existingLastModified.includes(today)) {
  console.log(`Today's article batch is already published for ${today}.`);
  process.exit(0);
}

const pending = queue.filter(([file]) => !existsSync(`articles/${file}`)).slice(0, limit);
if (!pending.length) {
  console.log("All queued articles are already published.");
  process.exit(0);
}

function source(file) {
  return execFileSync("git", ["show", `${sourceBranch}:articles/${file}`], { encoding: "utf8" });
}

let sitemap = readFileSync("sitemap.xml", "utf8");
const cards = [];
const urls = [];

for (const [file, category, title, description] of pending) {
  const [image, alt] = visuals[file];
  let html = source(file)
    .replaceAll(/"datePublished": "\d{4}-\d{2}-\d{2}"/g, `"datePublished": "${today}"`)
    .replaceAll(/"dateModified": "\d{4}-\d{2}-\d{2}"/g, `"dateModified": "${today}"`)
    .replaceAll(/datetime="\d{4}-\d{2}-\d{2}">\d{4}-\d{2}-\d{2}/g, `datetime="${today}">${today}`)
    .replace(/(<p class="lead">.*?<\/p>)/s, `$1<figure class="article-visual"><img src="${image}" alt="${alt}" loading="eager"><figcaption>Luvie product and application reference. Confirm final specifications for each SKU and project.</figcaption></figure>`);
  html = ensureTracking(html);
  if (!dryRun) writeFileSync(`articles/${file}`, html);
  cards.push(`
            <a class="article-card" href="${file}">
                <img src="${image}" alt="${alt}" loading="lazy">
                <div>
                    <span>${category}</span>
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
            </a>`);
  urls.push(`    <url>
        <loc>https://luvieindustry.com/articles/${file}</loc>
        <lastmod>${today}</lastmod>
        <priority>0.8</priority>
    </url>`);
}

if (!dryRun) {
  const close = "        </section>\n    </main>";
  if (!index.includes(close)) throw new Error("Article index insertion point not found.");
  index = index.replace(close, `${cards.join("")}\n        </section>\n    </main>`);
  index = index.replaceAll(/\s*<meta name="last-modified" content="\d{4}-\d{2}-\d{2}">/g, "");
  index = index.replace(/(<link rel="canonical" href="https:\/\/luvieindustry\.com\/articles\/">)/, `$1\n    <meta name="last-modified" content="${today}">`);
  sitemap = sitemap.replace("</urlset>", `${urls.join("\n")}\n</urlset>`);
  writeFileSync("articles/index.html", index);
  writeFileSync("sitemap.xml", sitemap);
}

console.log(`${dryRun ? "Would publish" : "Published"} ${pending.length} article(s):`);
for (const [file] of pending) console.log(`- https://luvieindustry.com/articles/${file}`);
