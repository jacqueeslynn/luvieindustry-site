import fs from 'node:fs';
import assert from 'node:assert/strict';
import {languages,products} from '../content/polycarbonate.mjs';
const root=new URL('../',import.meta.url),base='https://luvieindustry.com';
const sitemap=fs.readFileSync(new URL('sitemap.xml',root),'utf8');
let count=0;
for(const l of languages){const prefix=l==='en'?'':l+'/';for(const slug of ['',...products.map(p=>p[0])]){const route=prefix+'products/polycarbonate'+(slug?'/'+slug:'')+'.html';const h=fs.readFileSync(new URL(route,root),'utf8');assert(h.includes(`rel="canonical" href="${base}/${route}"`));assert(sitemap.includes(`<loc>${base}/${route}</loc>`));assert.equal((h.match(/hreflang=/g)||[]).length,4);assert.equal((h.match(/<h1>/g)||[]).length,1);assert(h.includes('wa.me/8619005833027'));assert(h.includes('?inquiry=1&amp;from='));assert(!h.includes('/assets/catalogs/'));if(l==='ar')assert(h.includes('dir="rtl"'));for(const [,src]of h.matchAll(/src="(\/assets\/[^\"]+)"/g))assert(fs.existsSync(new URL(src.slice(1),root)),src);count++;}}
for(const l of languages){const pre=l==='en'?'':l+'/';for(const slug of ['',...products.map(p=>p[0])]){const route=pre+'products/polycarbonate'+(slug?'/'+slug:'')+'.html';const h=fs.readFileSync(new URL(route,root),'utf8');assert.equal((h.match(/<!-- online-inquiry:start -->/g)||[]).length,1,route);const href=h.match(/class="online-inquiry"[\s\S]*?<a href="([^"]+)"/)[1].replaceAll('&amp;','&');const u=new URL(href,base);assert.equal(u.pathname,'/'+pre);assert.equal(u.searchParams.get('from'),'/'+route);if(slug)assert.equal((h.match(/class="series-section pc-detail"/g)||[]).length,3,route);}}
console.log(`PASS ${count} polycarbonate pages: metadata, sitemap, local images, localized inquiry components and product-specific sections`);
