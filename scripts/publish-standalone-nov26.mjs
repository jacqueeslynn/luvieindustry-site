import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const base='https://luvieindustry.com';
const date='2026-11-26';
const items=[
 ['uae-spc-vs-glue-down-lvt','spc-flooring','Zone map','Install','Reopen'],
 ['spc-ou-porcelanato-portas','spc-flooring','Altura atual','Piso novo','Folga'],
 ['wpc-ou-mdf-acesso-tecnico','wpc-wall-panels','Painel','Tampa','Acesso'],
 ['pvc-ou-gesso-acesso','pvc-ceiling-panels','Descarga','Percurso','Montagem'],
 ['colombia-pvc-o-ceramica','pvc-wall-panels','Preparación','Instalación','Reapertura'],
 ['mexico-pu-o-piedra','pu-stone-panels','Paño','Esquina','Remate'],
];
const copy={
 en:['Buyer guides','View product family','Request a sample or specification','Procurement checklist','Illustrative planning diagram'],
 'pt-BR':['Guias de compra','Ver linha de produtos','Solicitar amostra ou ficha técnica','Checklist de compra','Diagrama ilustrativo de planejamento'],
 es:['Guías de compra','Ver familia de productos','Solicitar muestra o ficha técnica','Lista de verificación','Diagrama ilustrativo de planificación']
};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
function write(p,v){fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v)}
const drafts=[...read('content/nov26-drafts.md').matchAll(/^## (en|pt-BR|es) — ([^\n]+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
if(drafts.length!==6 || drafts.map(d=>d[1]).join()!=='en,pt-BR,pt-BR,pt-BR,es,es')throw Error('Unexpected batch');
let sitemap=read('sitemap.xml');
const cards=new Map();
for(const [i,[,lang,title,body]] of drafts.entries()){
 const [slug,family,...steps]=items[i];
 const prefix=lang==='en'?'':lang.toLowerCase()+'/';
 const archive=prefix+'articles/';
 const route=archive+'field-guides/'+slug+'.html';
 const url=base+'/'+route;
 const image='assets/articles/'+slug+'.svg';
 const [hub,product,cta,check,caption]=copy[lang];
 const paragraphs=body.trim().split(/\n\s*\n/);
 const desc=paragraphs[0].split(/(?<=\.) /)[0];
 const localized=prefix+'products/'+family+'.html';
 if(!fs.existsSync(path.join(root,localized)))throw Error('Missing product '+localized);
 const palette=['#8f5037','#57716e','#73543a','#486579','#8c6251','#5f6651'];
 const diagram=steps.map((s,n)=>`<g transform="translate(${60+n*295} 126)"><rect width="255" height="150" rx="12" fill="${palette[i]}"/><path d="M26 55h${70+i*15}m-70 23h86" stroke="#fff4e6" stroke-width="7"/><text x="26" y="124" fill="white" font-size="23">${esc(s)}</text></g>`).join('');
 write(image,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360" font-family="sans-serif"><rect width="960" height="360" fill="#efe5d7"/><text x="60" y="75" fill="#352a23" font-size="27">Luvie Industry · ${esc(check)}</text>${diagram}</svg>`);
 write(route,`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Luvie</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><meta name="robots" content="index, follow, max-image-preview:large"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:image" content="${base}/${image}"><meta property="article:published_time" content="${date}"><style>body{margin:0;color:#33251c;background:#f6efe6;font:18px/1.65 system-ui}header,main{box-sizing:border-box;max-width:800px;margin:auto;padding:1rem 1.25rem}header{border-bottom:1px solid #d5c5b5}a{color:#703e24}h1{line-height:1.15;font-size:clamp(2rem,5vw,3rem)}img{width:100%;height:auto;display:block}figure{margin:1.5rem 0}figcaption,time{font-size:.85em}footer{margin:2rem 0;display:flex;gap:1rem;flex-wrap:wrap}</style></head><body><header><a href="/${prefix}">Luvie Industry</a> · <a href="/${archive}">${hub}</a></header><main><time datetime="${date}">${date}</time><article><h1>${esc(title)}</h1><p>${esc(paragraphs[0])}</p><figure><img src="/${image}" alt="${esc(steps.join(' · '))}" width="960" height="360"><figcaption>${caption}</figcaption></figure><h2>${check}</h2>${paragraphs.slice(1).map(p=>'<p>'+esc(p)+'</p>').join('')}<footer><a href="/${localized}">${product}</a><a href="https://wa.me/8619005833027">${cta}</a><a href="mailto:globalsales@luvieindustry.com">globalsales@luvieindustry.com</a></footer></article></main></body></html>`);
 if(!sitemap.includes('<loc>'+url+'</loc>'))sitemap=sitemap.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);
 const index=archive+'index.html';
 if(!cards.has(index))cards.set(index,{hub,links:[]});
 cards.get(index).links.push(`<li><a href="/${route}">${esc(title)}</a></li>`);
 console.log(route);
}
for(const [index,{hub,links}] of cards){
 const current=read(index).replace(/<!-- standalone-nov26:start -->[\s\S]*?<!-- standalone-nov26:end -->\n?/,'');
 if(!/<main\b[^>]*>/.test(current))throw Error('Archive main missing: '+index);
 write(index,current.replace(/<main\b[^>]*>/,m=>m+`\n<!-- standalone-nov26:start -->\n<section style="max-width:72rem;margin:1.5rem auto;padding:0 1rem"><h2>${hub} · ${date}</h2><ul>${links.join('')}</ul></section>\n<!-- standalone-nov26:end -->\n`));
}
write('sitemap.xml',sitemap);
