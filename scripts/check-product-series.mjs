import fs from 'node:fs';
import assert from 'node:assert/strict';
import {families,locales} from '../content/product-series.mjs';
const site='https://luvieindustry.com';
const sitemap=fs.readFileSync('sitemap.xml','utf8');
let pages=0;
for(const l of locales){const prefix=l==='en'?'':'/'+l;
 const home=fs.readFileSync('.'+prefix+'/index.html','utf8');assert.equal((home.match(/class="series-menu"/g)||[]).length,1);assert(home.includes('class="direct-wa"'));assert(home.includes('id="quickInquiryBtn"'));
 for(const route of ['/products/',...families.flatMap(f=>[`/products/${f.id}.html`,...f.children.map(c=>`/products/${f.id}/${c.slug}.html`)])]){
  const target=prefix+route;const h=fs.readFileSync('.'+target+(target.endsWith('/')?'index.html':''),'utf8');
  assert.equal((h.match(/<h1\b/g)||[]).length,1,target);assert(h.includes(`href="${site+target}"`),target);assert(sitemap.includes(`<loc>${site+target}</loc>`),target);
  assert(h.includes('class="direct-wa"'),target);assert(h.includes('wa.me/8619005833027'),target);assert(h.includes('product-guides:start'),target);assert(h.includes('G-VCLMP6Q5KJ'),target);
  for(const language of locales)assert(h.includes(`hreflang="${language==='pt-br'?'pt-BR':language}"`),target);
  for(const m of h.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){let file='.'+decodeURIComponent(m[1]);if(file.endsWith('/'))file+='index.html';assert(fs.existsSync(file),target+' -> '+file);}
  pages++;
 }
}
const map=JSON.parse(fs.readFileSync('content/product-article-map.json'));const articles=fs.readdirSync('articles').filter(f=>f.endsWith('.html')&&f!=='index.html');assert.equal(map.length,articles.length);assert.equal(new Set(map.map(x=>x.file)).size,articles.length);for(const a of map)assert(a.families.length);
console.log(`Product hierarchy passed: ${pages} four-language pages; ${map.length} articles classified; contact routes, sitemap, language tags and local links valid.`);
