import fs from 'node:fs';
import path from 'node:path';
const texts={en:['Product profile photographs','Open full-size photograph','Catalogue page 3 · Match the current sample and drawing before ordering.'],es:['Fotografías de perfiles de producto','Abrir fotografía a tamaño completo','Página 3 del catálogo · Confirme la muestra y el plano actuales antes de pedir.'],'pt-br':['Fotografias dos perfis dos produtos','Abrir fotografia em tamanho completo','Página 3 do catálogo · Confira a amostra e o desenho atuais antes de comprar.'],ar:['صور مقاطع المنتجات','فتح الصورة بالحجم الكامل','صفحة الكتالوج 3 · طابق العينة والرسم الحاليين قبل الطلب.']};
// Original embedded product-book images, visually matched to catalogue page 3.
// image2 is the coin-hole profile, NOT the 400 mm square-hole reference.
const photos=[{image:1,ref:'300 × 8 mm',slug:'300mm-honeycomb'},{image:3,ref:'400 × 6 mm',slug:'400mm-square-hole'},{image:4,ref:'400 × 7 mm',slug:'400mm-square-hole'}];
const src=p=>`/assets/quote-product-images/image${p.image}.jpeg`;
export function applyProductPhotos(root){
 for(const l of Object.keys(texts)){
  const prefix=l==='en'?'':l+'/',t=texts[l];
  for(const slug of ['', '300mm-honeycomb','400mm-square-hole']){
   const file=path.join(root,prefix+'products/pvc-wall-panels'+(slug?'/'+slug:'')+'.html');
   let h=fs.readFileSync(file,'utf8');
   const selected=photos.filter(p=>!slug||p.slug===slug);
   const gallery=`<!-- product-photos:start --><figure class="product-photo-gallery"><div class="product-photo-grid">${selected.map(p=>`<a href="${src(p)}" target="_blank" rel="noopener" aria-label="${t[1]}: ${p.ref}"><img src="${src(p)}" alt="PVC · ${p.ref}" width="${p.image===1?1368:1824}" height="${p.image===1?1824:1368}" loading="lazy"><span dir="ltr">${p.ref} ↗</span></a>`).join('')}</div><figcaption>${t[2]} <a href="/assets/catalogs/dream-house-wall-panel-catalog.pdf#page=3">PDF ↗</a></figcaption></figure><!-- product-photos:end -->`;
   h=h.replace(/<!-- product-photos:start -->[\s\S]*?<!-- product-photos:end -->/,gallery);
   if(slug)h=h.replace(/<figure><img src="\/assets\/catalogs\/covers\/dream-house-wall-panel.jpg"[\s\S]*?<\/figure>/,gallery);
   else h=h.replace(/<figure><img src="[^\"]*pvc-panel-profile.webp"[\s\S]*?<\/figure>/,gallery);
   // On subsequent builds the original hero no longer exists; restore at a stable location.
   if(!h.includes('<!-- product-photos:start -->'))h=h.replace('<!-- product-series:start -->',gallery+'<!-- product-series:start -->');
   h=h.replace(/(<a class="series-card" href="[^"]*pvc-wall-panels\/(300mm-honeycomb|400mm-square-hole)\.html">)(?:<img[^>]*>)?/g,(_,a,s)=>`${a}<img src="${src(photos.find(p=>p.slug===s))}" alt="PVC" width="320" height="200" loading="lazy">`);
   fs.writeFileSync(file,h);
  }
  const hub=path.join(root,prefix+'products/index.html');let h=fs.readFileSync(hub,'utf8');
  h=h.replace(/(<a class="series-card" href="[^"]*\/pvc-wall-panels.html"><img src=")[^"]+/,`$1${src(photos[0])}`);fs.writeFileSync(hub,h);
 }
}
