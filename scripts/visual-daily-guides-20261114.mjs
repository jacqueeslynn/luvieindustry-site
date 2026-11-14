import fs from 'node:fs';
import path from 'node:path';
import {chromium} from '/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {guides} from '../content/daily-guides-20261114.mjs';
const out=path.resolve(import.meta.dirname,'../../verification-20261114');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});const results=[];
for(const width of [390,1440])for(const locale of ['en','es','pt-br','ar'])for(const [i,g]of guides.entries()){
 const p=await browser.newPage({viewport:{width,height:900}});
 const prefix=locale==='en'?'':`/${locale}`;
 await p.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 await p.goto(`http://127.0.0.1:8774${prefix}/articles/${g.file}`,{waitUntil:'domcontentloaded'});
 await p.evaluate(()=>Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});})));
 const report=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),h1:document.querySelector('h1').textContent,dir:document.documentElement.dir,lang:document.documentElement.lang}));
 if(report.overflow||report.broken.length)throw Error(JSON.stringify(report));
 await p.screenshot({path:path.join(out,`${locale}-${i}-${width}.png`),fullPage:true});
 if(i===0){await p.locator('.language-switch a[lang="es"]').click();await p.waitForURL('**/es/articles/**',{waitUntil:'domcontentloaded'});await p.locator('section a[href="/es/products/pvc-ceiling-panels.html"]').first().click();await p.waitForURL('**/es/products/pvc-ceiling-panels.html',{waitUntil:'domcontentloaded'});}
 results.push({locale,width,file:g.file,...report});await p.close();
}
await browser.close();fs.writeFileSync(path.join(out,'visual-results.json'),JSON.stringify(results,null,2));console.log(`Verified ${results.length} views`);
