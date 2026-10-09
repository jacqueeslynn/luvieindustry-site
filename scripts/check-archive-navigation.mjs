import fs from 'node:fs';
import assert from 'node:assert/strict';
for(const locale of ['','es/','pt-br/','ar/']){
 const html=fs.readFileSync(`${locale}articles/index.html`,'utf8');
 assert.equal((html.match(/id="latest-guides"/g)||[]).length,1);
 assert(!html.includes('href="#supplier-quality"'));
 const links=[...html.matchAll(/<a\b[^>]*class="article-card"[^>]*href="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(links).size,links.length,'Duplicate archive cards');
 for(const anchor of ['systems','catalog'])assert(fs.readFileSync(`${locale}index.html`,'utf8').includes(`id="${anchor}"`));
 assert(html.includes('href="mailto:jinsburg@luvieindustry.com"'));
 assert(!/AI-generated|generada con IA|gerada por IA|مولدة بالذكاء/.test(fs.readFileSync(`${locale}articles/pvc-wall-panel-disinfectant-compatibility.html`,'utf8')));
}
console.log('Archive navigation and illustration wording passed in four languages.');
