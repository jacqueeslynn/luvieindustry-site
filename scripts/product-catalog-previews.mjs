import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {families,locales} from '../content/product-series.mjs';
const copy={en:'Catalogue detail — open the source page. Illustrations and printed claims are catalogue content, not independent test evidence. Confirm the selected model with our team.',es:'Detalle del catálogo: abra la página original. Las ilustraciones y afirmaciones impresas no son pruebas independientes. Confirme el modelo elegido con nuestro equipo.','pt-br':'Detalhe do catálogo: abra a página original. Ilustrações e declarações impressas não são evidências de ensaio independente. Confirme o modelo escolhido com nossa equipe.',ar:'تفاصيل الكتالوج — افتح الصفحة الأصلية. الرسوم والادعاءات المطبوعة هي محتوى الكتالوج وليست أدلة اختبار مستقلة. أكد الطراز المختار مع فريقنا.'};
const asset=(f,p)=>`/assets/catalogs/details/${f.id}-${p}.jpg`;
export function applyCatalogPreviews(root){
 fs.mkdirSync(path.join(root,'assets/catalogs/details'),{recursive:true});
 for(const f of families.filter(f=>f.id!=='pvc-wall-panels')){
  for(const p of new Set(f.children.map(c=>parseInt(c.page)))){
   const target=path.join(root,asset(f,p));
   if(!fs.existsSync(target))execFileSync('pdftoppm',['-f',String(p),'-l',String(p),'-singlefile','-scale-to','1100','-jpeg','-jpegopt','quality=85',path.join(root,'assets/catalogs',f.catalog),target.slice(0,-4)]);
  }
  for(const l of locales){const prefix=l==='en'?'':l+'/';
   const preview=(p)=>`<!-- catalog-detail:start --><figure class="catalog-detail"><a href="/assets/catalogs/${f.catalog}#page=${p}"><img src="${asset(f,p)}" alt="${f.name[l]} · PDF ${p}" width="1100" height="1100" loading="lazy"></a><figcaption>${copy[l]}</figcaption></figure><!-- catalog-detail:end -->`;
   for(const c of [null,...f.children]){const p=parseInt((c||f.children[0]).page);const file=path.join(root,prefix+'products/'+f.id+(c?'/'+c.slug:'')+'.html');let h=fs.readFileSync(file,'utf8');
    if(h.includes('<!-- catalog-detail:start -->'))h=h.replace(/<!-- catalog-detail:start -->[\s\S]*?<!-- catalog-detail:end -->/,preview(p));
    else h=h.replace(/<figure>\s*<img[^>]+>[\s\S]*?<\/figure>/,preview(p));
    fs.writeFileSync(file,h);
   }
   // Family and sibling cards use real catalogue details rather than shared covers.
   for(const route of ['products/index.html',...families.flatMap(x=>['products/'+x.id+'.html',...x.children.map(c=>'products/'+x.id+'/'+c.slug+'.html')])]){
    const file=path.join(root,prefix+route);let h=fs.readFileSync(file,'utf8');
    h=h.replace(new RegExp(`(<a class="series-card" href="[^"]*/${f.id}\\.html"><img src=")[^"]+`,'g'),`$1${asset(f,parseInt(f.children[0].page))}`);
    for(const c of f.children)h=h.replace(new RegExp(`(<a class="series-card" href="[^"]*/${f.id}/${c.slug}\\.html">)(?:<img[^>]*>)?`,'g'),`$1<img class="catalog-card-detail" src="${asset(f,parseInt(c.page))}" alt="${f.name[l]} · PDF ${c.page}" width="320" height="240" loading="lazy">`);
    fs.writeFileSync(file,h);
   }
  }
 }
}
