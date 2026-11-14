import fs from 'node:fs';
import path from 'node:path';
import {guides} from '../content/daily-guides-20261114.mjs';
const root=path.resolve(import.meta.dirname,'..');
const base=process.env.VERIFY_BASE||'https://luvieindustry.com';
const results=[];
const sitemap=await fetch(`${base}/sitemap.xml`).then(r=>{if(!r.ok)throw Error(`sitemap ${r.status}`);return r.text()});
for(const g of guides)for(const locale of ['','es','pt-br','ar']){
 const route=`/${locale?locale+'/':''}articles/${g.file}`;
 const response=await fetch(base+route);const html=await response.text();
 if(response.status!==200)throw Error(`${route}: ${response.status}`);
 if(html!==fs.readFileSync(path.join(root,route),'utf8'))throw Error(`Stale public content ${route}`);
 if(!sitemap.includes(`https://luvieindustry.com${route}`))throw Error(`Missing public sitemap entry ${route}`);
 results.push({route,status:response.status,exactContent:true,sitemap:true});
}
for(const g of guides){const r=await fetch(`${base}/assets/articles/${g.image}`);if(r.status!==200)throw Error(`Image ${g.image}: ${r.status}`);}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),pages:results},null,2));
