import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { date, guides } from '../content/daily-guides-20261007.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://luvieindustry.com';
const locales = { en: { prefix: '', lang: 'en', dir: 'ltr' }, es: { prefix: '/es', lang: 'es', dir: 'ltr' }, 'pt-br': { prefix: '/pt-br', lang: 'pt-BR', dir: 'ltr' }, ar: { prefix: '/ar', lang: 'ar', dir: 'rtl' } };
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const problems = [];
const check = (condition, message) => { if (!condition) problems.push(message); };
for (const guide of guides) {
  check(fs.existsSync(path.join(root, 'assets/articles', guide.image)), `Missing image: ${guide.image}`);
  for (const [locale, settings] of Object.entries(locales)) {
    const route = `${settings.prefix}/articles/${guide.file}`;
    const source = fs.readFileSync(path.join(root, route.slice(1)), 'utf8');
    const copy = guide[locale];
    check(source.includes(`<html lang="${settings.lang}" dir="${settings.dir}">`), `Wrong language/direction: ${route}`);
    check(source.includes(`<link rel="canonical" href="${base}${route}">`), `Missing canonical: ${route}`);
    for (const [other, alternative] of Object.entries(locales)) {
      check(source.includes(`<link rel="alternate" hreflang="${alternative.lang}" href="${base}${alternative.prefix}/articles/${guide.file}">`), `Missing ${other} hreflang: ${route}`);
    }
    check(source.includes(`<h1>${copy.heading}</h1>`), `Missing localized H1: ${route}`);
    for (const [heading, paragraph] of copy.sections) check(source.includes(heading) && source.includes(paragraph), `Missing body section: ${route}: ${heading}`);
    check(source.includes(guide.source), `Missing reference: ${route}`);
    check(source.includes(guide.catalog), `Missing catalog: ${route}`);
    const productRoute = fs.existsSync(path.join(root, `${settings.prefix}${guide.product}`.slice(1))) ? `${settings.prefix}${guide.product}` : guide.product;
    check(source.includes(`href="${productRoute}"`), `Missing product link: ${route}`);
    check(source.includes(`<meta property="article:published_time" content="${date}">`), `Wrong date: ${route}`);
    check(sitemap.includes(`<loc>${base}${route}</loc>`), `Missing sitemap URL: ${route}`);
    check(!/[\u3400-\u9fff]/u.test(source), `Chinese text in ${route}`);
    for (const related of guide.related) check(fs.existsSync(path.join(root, `${settings.prefix}/articles/${related}`.slice(1))), `Broken related article: ${route} -> ${related}`);
    check(fs.readFileSync(path.join(root, `${settings.prefix}/articles/index.html`.slice(1)), 'utf8').includes(`href="${locale === 'en' ? guide.file : route}"`), `Missing hub card: ${route}`);
  }
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`Daily guide check passed: ${guides.length} guides, ${guides.length * 4} localized URLs, canonical/hreflang, body, links and sitemap.`);
