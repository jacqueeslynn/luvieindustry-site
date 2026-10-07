import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { date, guides } from '../content/daily-guides-20261007.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://luvieindustry.com';
const locales = {
  en: { prefix: '', html: 'en', dir: 'ltr', home: 'Home', resources: 'Resources', reference: 'Independent reference', caveat: 'General guidance, not a Luvie product certification.', more: 'Related buyer guides', catalog: 'Product catalog (PDF)', product: 'Explore this product family', contact: 'Discuss a sample and specification', image: 'Original explanatory diagram; not a product photograph.' },
  es: { prefix: '/es', html: 'es', dir: 'ltr', home: 'Inicio', resources: 'Guías', reference: 'Referencia independiente', caveat: 'Orientación general; no certifica productos Luvie.', more: 'Guías relacionadas', catalog: 'Catálogo de productos (PDF)', product: 'Explorar esta familia', contact: 'Consultar muestra y especificaciones', image: 'Diagrama explicativo original; no es fotografía de producto.' },
  'pt-br': { prefix: '/pt-br', html: 'pt-BR', dir: 'ltr', home: 'Início', resources: 'Guias', reference: 'Referência independente', caveat: 'Orientação geral; não certifica produtos Luvie.', more: 'Guias relacionados', catalog: 'Catálogo de produtos (PDF)', product: 'Explorar esta linha', contact: 'Consultar amostra e especificações', image: 'Diagrama explicativo original; não é fotografia de produto.' },
  ar: { prefix: '/ar', html: 'ar', dir: 'rtl', home: 'الرئيسية', resources: 'الأدلة', reference: 'مرجع مستقل', caveat: 'إرشاد عام وليس شهادة لمنتجات Luvie.', more: 'أدلة ذات صلة', catalog: 'كتالوج المنتجات PDF', product: 'استكشف فئة المنتج', contact: 'استفسر عن العينة والمواصفات', image: 'رسم توضيحي أصلي؛ ليس صورة منتج.' },
};
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const route = (locale, file) => `${locales[locale].prefix}/articles/${file}`;
const codes = Object.keys(locales);
const label = { en: 'English', es: 'Español', 'pt-br': 'Português (Brasil)', ar: 'العربية' };
const whatsappInquiry = {
  en: 'Hello Luvie, I would like a current sample and specification for the selected product.',
  es: 'Hola, Luvie. Quisiera solicitar una muestra y las especificaciones actuales del producto seleccionado.',
  'pt-br': 'Olá, Luvie. Gostaria de solicitar uma amostra e as especificações atuais do produto selecionado.',
  ar: 'مرحباً Luvie، أود طلب عينة والمواصفات الحالية للمنتج الذي اخترته.',
};
function page(guide, locale) {
  const l = locales[locale], copy = guide[locale], url = `${base}${route(locale, guide.file)}`;
  const image = `${base}/assets/articles/${guide.image}`;
  const alternates = codes.map(code => `<link rel="alternate" hreflang="${locales[code].html}" href="${base}${route(code, guide.file)}">`).join('');
  const switches = codes.map(code => `<a href="${route(code, guide.file)}" lang="${locales[code].html}"${code === locale ? ' aria-current="page"' : ''}>${label[code]}</a>`).join(' ');
  const related = guide.related.map(file => {
    const localTitle = guides.find(item => item.file === file)?.[locale].heading;
    const existing = fs.readFileSync(path.join(root, `${l.prefix}/articles/${file}`.slice(1)), 'utf8').match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    return `<a href="${file}">${localTitle ? esc(localTitle) : existing ?? esc(file.replaceAll('-', ' ').replace('.html', ''))}</a>`;
  }).join(' ');
  const productRoute = fs.existsSync(path.join(root, `${l.prefix}${guide.product}`.slice(1))) ? `${l.prefix}${guide.product}` : guide.product;
  const sourceName = locale === 'en' ? guide.sourceName : guide.sourceName.startsWith('CIE') ? { es: 'CIE: evaluación visual del color', 'pt-br': 'CIE: avaliação visual de cores', ar: 'CIE: التقييم البصري للألوان' }[locale] : { es: 'EPA: guía de control de humedad', 'pt-br': 'EPA: guia de controle de umidade', ar: 'EPA: إرشادات ضبط الرطوبة' }[locale];
  const sections = copy.sections.map(([heading, body]) => `<section><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`).join('\n');
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${base}/#organization`, name: 'Luvie Industry', url: `${base}/`, logo: `${base}/assets/brand/luvie-logo.webp` },
    { '@type': 'Article', headline: copy.heading, description: copy.description, inLanguage: l.html, datePublished: date, dateModified: date, image, author: { '@id': `${base}/#organization` }, publisher: { '@id': `${base}/#organization` }, mainEntityOfPage: url, citation: [guide.source] },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: l.home, item: `${base}${l.prefix}/` }, { '@type': 'ListItem', position: 2, name: l.resources, item: `${base}${l.prefix}/articles/` }, { '@type': 'ListItem', position: 3, name: copy.heading, item: url }] }
  ] });
  const shortAnswer = { en: 'Short answer', es: 'Respuesta breve', 'pt-br': 'Resposta curta', ar: 'إجابة مختصرة' }[locale];
  const next = { en: 'Next step', es: 'Siguiente paso', 'pt-br': 'Próximo passo', ar: 'الخطوة التالية' }[locale];
  return `<!doctype html><html lang="${l.html}" dir="${l.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(copy.title)}</title><meta name="description" content="${esc(copy.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="Luvie Industry"><meta name="content-series" content="2026-daily"><meta property="article:published_time" content="${date}"><meta property="article:modified_time" content="${date}"><link rel="canonical" href="${url}">${alternates}<meta property="og:type" content="article"><meta property="og:site_name" content="Luvie Industry"><meta property="og:title" content="${esc(copy.title)}"><meta property="og:description" content="${esc(copy.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(copy.title)}"><meta name="twitter:description" content="${esc(copy.description)}"><meta name="twitter:image" content="${image}"><link rel="icon" href="/assets/brand/favicon-32.png"><link rel="stylesheet" href="/assets/daily-guides.css"><script type="application/ld+json">${schema}</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VCLMP6Q5KJ');</script><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1331142262420820');fbq('track','PageView');</script></head><body><header class="site-header"><div class="wrap nav"><a class="brand" href="${l.prefix}/">LUVIE INDUSTRY</a><a href="${l.prefix}/articles/">${l.resources}</a><a class="contact" href="https://wa.me/306947135317">${l.contact}</a></div></header><main class="wrap"><nav class="languages language-switch" aria-label="Language versions">${switches}</nav><article><nav class="breadcrumbs"><a href="${l.prefix}/">${l.home}</a> / <a href="${l.prefix}/articles/">${l.resources}</a></nav><p class="eyebrow">Luvie Industry · ${date}</p><h1>${esc(copy.heading)}</h1><p class="lead">${esc(copy.lead)}</p><figure><img src="/assets/articles/${guide.image}" alt="${esc(copy.heading)}" width="1200" height="800"><figcaption>${l.image}</figcaption></figure><div class="answer"><strong>${shortAnswer}</strong><p>${esc(copy.answer)}</p></div><!-- topic-cluster-links:start --><nav class="related" aria-label="Related buyer guides"><strong>${l.more}</strong><p>${related}</p></nav><!-- topic-cluster-links:end --><!-- authority-evidence:start --><aside class="authority-evidence"><strong>${l.reference}</strong><p><a href="${guide.source}" rel="noopener noreferrer external" target="_blank">${esc(sourceName)}</a>. ${l.caveat}</p></aside><!-- authority-evidence:end -->${sections}<section><h2>${next}</h2><p>${esc(copy.closing)}</p><p><a href="${guide.catalog}">${l.catalog}</a> · <a href="${productRoute}">${l.product}</a></p></section><div class="cta"><a href="https://wa.me/306947135317?text=${encodeURIComponent(whatsappInquiry[locale])}">${l.contact}</a></div></article></main><footer class="wrap footer">Luvie Industry · <a href="mailto:jinsburg@luvieindustry.com">jinsburg@luvieindustry.com</a> · +30 6947135317</footer></body></html>\n`;
}

for (const guide of guides) {
  if (!fs.existsSync(path.join(root, 'assets/articles', guide.image))) throw new Error(`Missing image ${guide.image}`);
  if (!fs.existsSync(path.join(root, guide.catalog.slice(1)))) throw new Error(`Missing catalog ${guide.catalog}`);
  for (const code of codes) {
    if (!guide[code] || guide[code].sections.length !== 4) throw new Error(`Incomplete ${code} article ${guide.file}`);
    const existing = path.join(root, route(code, guide.file).slice(1));
    if (fs.existsSync(existing) && !fs.readFileSync(existing, 'utf8').includes(`<meta property="article:published_time" content="${date}">`)) throw new Error(`Refusing to overwrite ${route(code, guide.file)}`);
  }
}
const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
for (const guide of guides) for (const code of codes) if (sitemap.includes(`<loc>${base}${route(code, guide.file)}</loc>`)) sitemap = sitemap.replace(`    <url><loc>${base}${route(code, guide.file)}</loc><lastmod>${date}</lastmod><priority>0.7</priority></url>\n`, '');
for (const guide of guides) for (const code of codes) {
  const target = path.join(root, route(code, guide.file).slice(1));
  fs.writeFileSync(target, page(guide, code));
  sitemap = sitemap.replace('</urlset>', `    <url><loc>${base}${route(code, guide.file)}</loc><lastmod>${date}</lastmod><priority>0.7</priority></url>\n</urlset>`);
}
for (const code of codes) {
  const target = path.join(root, `${locales[code].prefix}/articles/index.html`.slice(1));
  let index = fs.readFileSync(target, 'utf8');
  for (const guide of guides) {
    const href = route(code, guide.file);
    const start = index.indexOf(`<a class="article-card" href="${href}">`) >= 0
      ? index.indexOf(`<a class="article-card" href="${href}">`)
      : index.indexOf(`<a class="article-card" href="${guide.file}">`);
    if (start >= 0) {
      const end = index.indexOf('</a>', start);
      if (end < 0) throw new Error(`Malformed existing card ${href}`);
      index = index.slice(0, start) + index.slice(end + 4);
    }
  }
  const cards = guides.map(guide => `<a class="article-card" href="${code === 'en' ? guide.file : route(code, guide.file)}"><img src="/assets/articles/${guide.image}" alt="${esc(guide[code].heading)}" loading="lazy"><div><span>${date}</span><h2>${esc(guide[code].heading)}</h2><p>${esc(guide[code].description)}</p></div></a>`).join('\n');
  if (code === 'en') index = index.replace('        </section>\n    </main>', `${cards}\n        </section>\n    </main>`);
  else index = index.replace('</section>\n</main>', `${cards}\n</section>\n</main>`);
  if (!index.includes(`href="${code === 'en' ? guides[0].file : route(code, guides[0].file)}"`)) throw new Error(`Could not update ${target}`);
  fs.writeFileSync(target, index);
  sitemap = sitemap.replace(new RegExp(`(<loc>${base.replaceAll('.', '\\.').replaceAll('/', '\\/')}${locales[code].prefix}\\/articles\\/<\\/loc>\\s*<lastmod>)[^<]+`), `$1${date}`);
}
sitemap = sitemap.replace(/(<loc>https:\/\/luvieindustry\.com\/<\/loc>\s*<lastmod>)[^<]+/, `$1${date}`);
fs.writeFileSync(sitemapFile, sitemap);
console.log(`Created ${guides.length} English guides and ${guides.length * 3} translations for ${date}`);
