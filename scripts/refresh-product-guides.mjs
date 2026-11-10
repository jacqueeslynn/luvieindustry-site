import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {families,locales,labels} from '../content/product-series.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const toolsText={en:['Search buyer guides','No matching guides. Try a product or purchasing topic.','Compare catalogue options','Option','Catalogue reference','View details'],es:['Buscar guías de compra','No hay coincidencias. Pruebe un producto o tema de compra.','Comparar opciones del catálogo','Opción','Referencia del catálogo','Ver detalles'],'pt-br':['Pesquisar guias de compra','Nenhum resultado. Tente um produto ou assunto de compra.','Comparar opções do catálogo','Opção','Referência do catálogo','Ver detalhes'],ar:['البحث في أدلة الشراء','لا توجد نتائج مطابقة. جرّب منتجاً أو موضوع شراء.','مقارنة خيارات الكتالوج','الخيار','مرجع الكتالوج','عرض التفاصيل']};
function enhance(h,l,f,prefix){
 const t=toolsText[l];
 h=h.replace(/(<section class="series-section series-family-block" id="buying-guides"><h2>[^<]*<\/h2>)/,`$1<div class="series-search" hidden><label for="guide-search">${t[0]}</label><input id="guide-search" type="search" autocomplete="off" placeholder="${t[0]}"><p class="series-no-results" role="status" hidden>${t[1]}</p></div>`);
 h=h.replace(/<!-- series-compare:start -->[\s\S]*?<!-- series-compare:end -->/,'');
 if(f){const table=`<!-- series-compare:start --><section class="series-section series-family-block"><h2>${t[2]}</h2><div class="series-table-wrap" tabindex="0" role="region" aria-label="${t[2]}"><table class="series-table"><thead><tr><th scope="col">${t[3]}</th><th scope="col">${t[4]}</th><th scope="col">PDF</th></tr></thead><tbody>${f.children.map(c=>`<tr><th scope="row"><a href="/${prefix}products/${f.id}/${c.slug}.html">${c.name[l]}</a></th><td><bdi>${esc(c.ref)}</bdi></td><td><a href="/assets/catalogs/${f.catalog}#page=${parseInt(c.page)}">${c.page} ↗</a></td></tr>`).join('')}</tbody></table></div><p class="series-comparison-note">${labels[l].note}</p></section><!-- series-compare:end -->`;h=h.replace('<!-- product-series:end -->','<!-- product-series:end -->'+table);}
 return h;
}
export function refreshProductGuides(){
 if(!fs.existsSync(path.join(root,'products/index.html')))return;
 const articles=fs.readdirSync(path.join(root,'articles')).filter(f=>f.endsWith('.html')&&f!=='index.html').map(file=>{const h=fs.readFileSync(path.join(root,'articles',file),'utf8');const title=h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g,'')||file;let groups=families.filter(f=>new RegExp(f.match,'i').test(file+' '+title)).map(f=>f.id);if(groups.includes('pvc-ceiling-panels'))groups=groups.filter(x=>x!=='pvc-wall-panels');if(groups.includes('outdoor-wpc'))groups=groups.filter(x=>x!=='wpc-wall-panels');return{file,title,groups};});
 const manifest=[];
 for(const l of locales){const prefix=l==='en'?'':l+'/';const ui=labels[l];
  const link=a=>{let file=prefix+'articles/'+a.file;if(!fs.existsSync(path.join(root,file))&&a.file==='fluted-wall-panels-distributor-guide.html')file=prefix+'articles/'+({es:'panel-ranurado-pvc-pared.html','pt-br':'painel-ripado-pvc-parede.html',ar:'fluted-pvc-wall-panels.html'}[l]||a.file);if(!fs.existsSync(path.join(root,file)))throw Error('Missing translation '+file);const h=fs.readFileSync(path.join(root,file),'utf8');const title=h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g,'')||a.title;return `<li><a href="/${file}">${title}</a></li>`;};
  const update=(file,list,title)=>{if(!fs.existsSync(path.join(root,file)))return;let h=fs.readFileSync(path.join(root,file),'utf8');const rows=list.map(link);const block=`<!-- product-guides:start --><section class="series-section series-family-block" id="buying-guides"><h2>${title}</h2><ul class="series-reading">${rows.slice(0,6).join('')}</ul>${rows.length>6?`<details><summary>${ui.more} (${rows.length-6})</summary><ul class="series-reading">${rows.slice(6).join('')}</ul></details>`:''}</section><!-- product-guides:end -->`;if(h.includes('<!-- product-guides:start -->'))h=h.replace(/<!-- product-guides:start -->[\s\S]*?<!-- product-guides:end -->/,block);else h=h.replace('</main>',block+'</main>');fs.writeFileSync(path.join(root,file),h);};
  update(prefix+'products/index.html',articles.filter(a=>!a.groups.length),ui.resources);
  for(const f of families){const list=articles.filter(a=>a.groups.includes(f.id));update(prefix+`products/${f.id}.html`,list,ui.guides);for(const c of f.children)update(prefix+`products/${f.id}/${c.slug}.html`,list,ui.guides);}
  for(const [file,f] of [[prefix+'products/index.html',null],...families.flatMap(f=>[[prefix+`products/${f.id}.html`,f],...f.children.map(c=>[prefix+`products/${f.id}/${c.slug}.html`,null])])]){const p=path.join(root,file);fs.writeFileSync(p,enhance(fs.readFileSync(p,'utf8'),l,f,prefix));}
 }
 for(const a of articles)manifest.push({file:a.file,families:a.groups.length?a.groups:['general-procurement']});
 fs.writeFileSync(path.join(root,'content/product-article-map.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(`Product guides: ${articles.length} existing articles classified; original URLs unchanged.`);
}
if(process.argv[1]===fileURLToPath(import.meta.url))refreshProductGuides();
