import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const meta=(html,key)=>[...html.matchAll(/<meta\b[^>]+>/g)].map(x=>x[0]).find(x=>x.includes(`property="${key}"`)||x.includes(`name="${key}"`))?.match(/content="([^"]+)"/)?.[1]??'';
export function refreshHomepageLatest(){
 for(const locale of ['','es','pt-br','ar']){
  const folder=path.join(root,locale,'articles');
  const archive=fs.readdirSync(folder).filter(x=>x.endsWith('.html')&&x!=='index.html').map(file=>{
   const html=fs.readFileSync(path.join(folder,file),'utf8');
   return {file,date:meta(html,'article:published_time'),title:html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]??'',image:meta(html,'og:image').replace('https://luvieindustry.com','')};
  }).filter(x=>x.date&&x.title).sort((a,b)=>b.date.localeCompare(a.date)||a.file.localeCompare(b.file));
  const articles=archive.slice(0,3);
  const hubPath=path.join(folder,'index.html'); let hub=fs.readFileSync(hubPath,'utf8');
  const pattern=/<a\b[^>]*class="article-card"[^>]*>[\s\S]*?<\/a>/g;
  const seen=new Set();
  const cardsInHub=[...hub.matchAll(pattern)].map(([html])=>({html,date:archive.find(x=>html.match(/href="([^"]+)"/)?.[1].split('/').pop()===x.file)?.date??''})).filter(card=>{
   const url=new URL(card.html.match(/href="([^"]+)"/)[1],`https://luvieindustry.com/${locale?locale+'/':''}articles/`).href;
   if(seen.has(url))return false;seen.add(url);return true;
  }).sort((a,b)=>b.date.localeCompare(a.date));
  // A chronological archive must not retain topic headings from the old order.
  const labels={
   '':['Latest buyer guides','Newest first. Compare materials, review samples and plan your order.','Products','Catalogs','Contact'],
   es:['Últimas guías de compra','De más reciente a más antigua. Compare materiales, revise muestras y planifique su pedido.','Productos','Catálogos','Contacto'],
   'pt-br':['Guias de compra recentes','Do mais recente ao mais antigo. Compare materiais, avalie amostras e planeje seu pedido.','Produtos','Catálogos','Contato'],
   ar:['أحدث أدلة الشراء','من الأحدث إلى الأقدم. قارن المواد وراجع العينات وخطط لطلبك.','المنتجات','الكتالوجات','تواصل معنا']
  }[locale];
  const homeRoute=locale?`/${locale}/`:'/';
  hub=hub.replace(/<nav\b[^>]*class="[^"]*resource-topic-nav[^"]*"[^>]*>[\s\S]*?<\/nav>/,
   `<nav class="container resource-topic-nav" aria-label="${labels[0]}"><a href="#latest-guides">${labels[0]}</a><a href="${homeRoute}#systems">${labels[2]}</a><a href="${homeRoute}#catalog">${labels[3]}</a><a href="mailto:jinsburg@luvieindustry.com">${labels[4]}</a></nav>`);
  hub=hub.replace(/(<section\b[^>]*class="[^"]*article-grid[^"]*"[^>]*>)[\s\S]*?(<\/section>)/,
   (_,open,close)=>`${open}\n<div class="article-section-heading" id="latest-guides"><h2>${labels[0]}</h2><p>${labels[1]}</p></div>\n${cardsInHub.map(x=>x.html).join('\n')}\n${close}`);
  hub=hub.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(whole,json)=>{
   const data=JSON.parse(json);const list=data['@graph']?.find(x=>x['@type']==='ItemList');if(!list)return whole;
   list.itemListElement=cardsInHub.map((card,i)=>({'@type':'ListItem',position:i+1,name:(card.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]??'').replaceAll('&amp;','&'),url:new URL(card.html.match(/href="([^"]+)"/)[1],`https://luvieindustry.com/${locale?locale+'/':''}articles/`).href}));
   list.numberOfItems=list.itemListElement.length;
   return `<script type="application/ld+json">${JSON.stringify(data,null,2)}</script>`;
  });fs.writeFileSync(hubPath,hub);
  const target=path.join(root,locale,'index.html');let home=fs.readFileSync(target,'utf8');
  if(!home.includes('<!--latest-guides:start-->')) continue;
  const prefix=locale?`/${locale}`:'';
  const cards='<div class="latest-guides-grid">'+articles.map(x=>`<a class="latest-guide" href="${prefix}/articles/${x.file}"><img src="${x.image}" alt="" loading="lazy" width="82" height="92"><div><time datetime="${x.date}">${x.date}</time><h3>${x.title}</h3></div></a>`).join('')+'</div>';
  home=home.replace(/<!--latest-guides:start-->[\s\S]*?<!--latest-guides:end-->/,`<!--latest-guides:start-->${cards}<!--latest-guides:end-->`);
  fs.writeFileSync(target,home);
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url)) refreshHomepageLatest();
