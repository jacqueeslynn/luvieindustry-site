import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {families,locales,labels} from '../content/product-series.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function refreshProductGuides(){
 if(!fs.existsSync(path.join(root,'products/index.html')))return;
 const articles=fs.readdirSync(path.join(root,'articles')).filter(f=>f.endsWith('.html')&&f!=='index.html').map(file=>{const h=fs.readFileSync(path.join(root,'articles',file),'utf8');const title=h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g,'')||file;let groups=families.filter(f=>new RegExp(f.match,'i').test(file+' '+title)).map(f=>f.id);if(groups.includes('pvc-ceiling-panels'))groups=groups.filter(x=>x!=='pvc-wall-panels');if(groups.includes('outdoor-wpc'))groups=groups.filter(x=>x!=='wpc-wall-panels');return{file,title,groups};});
 const manifest=[];
 for(const l of locales){const prefix=l==='en'?'':l+'/';const ui=labels[l];
  const link=a=>{let file=prefix+'articles/'+a.file;if(!fs.existsSync(path.join(root,file))&&a.file==='fluted-wall-panels-distributor-guide.html')file=prefix+'articles/'+({es:'panel-ranurado-pvc-pared.html','pt-br':'painel-ripado-pvc-parede.html',ar:'fluted-pvc-wall-panels.html'}[l]||a.file);if(!fs.existsSync(path.join(root,file)))throw Error('Missing translation '+file);const h=fs.readFileSync(path.join(root,file),'utf8');const title=h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g,'')||a.title;return `<li><a href="/${file}">${title}</a></li>`;};
  const update=(file,list,title)=>{if(!fs.existsSync(path.join(root,file)))return;let h=fs.readFileSync(path.join(root,file),'utf8');const rows=list.map(link);const block=`<!-- product-guides:start --><section class="series-section series-family-block" id="buying-guides"><h2>${title}</h2><ul class="series-reading">${rows.slice(0,6).join('')}</ul>${rows.length>6?`<details><summary>${ui.more} (${rows.length-6})</summary><ul class="series-reading">${rows.slice(6).join('')}</ul></details>`:''}</section><!-- product-guides:end -->`;if(h.includes('<!-- product-guides:start -->'))h=h.replace(/<!-- product-guides:start -->[\s\S]*?<!-- product-guides:end -->/,block);else h=h.replace('</main>',block+'</main>');fs.writeFileSync(path.join(root,file),h);};
  update(prefix+'products/index.html',articles.filter(a=>!a.groups.length),ui.resources);
  for(const f of families){const list=articles.filter(a=>a.groups.includes(f.id));update(prefix+`products/${f.id}.html`,list,ui.guides);for(const c of f.children)update(prefix+`products/${f.id}/${c.slug}.html`,list,ui.guides);}
 }
 for(const a of articles)manifest.push({file:a.file,families:a.groups.length?a.groups:['general-procurement']});
 fs.writeFileSync(path.join(root,'content/product-article-map.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(`Product guides: ${articles.length} existing articles classified; original URLs unchanged.`);
}
if(process.argv[1]===fileURLToPath(import.meta.url))refreshProductGuides();
