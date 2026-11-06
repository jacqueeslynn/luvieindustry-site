// Explicit one-off approval: publish all 60 Desktop review guides, 2026-11-06.
// Original Desktop review package is preserved unchanged.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = new URL('../', import.meta.url).pathname;
const source = '/Users/mac/Desktop/Luvie_60_Article_Drafts_2026-11-02';
const manifest = JSON.parse(fs.readFileSync(path.join(source,'manifest.json')));
if(manifest.length !== 60) throw Error('Expected 60 approved originals');
const guides=[], images=[], hashes=new Set();
// Reviewed phrase/sentence corrections only; never replace short substrings globally.
const corrections={
 '01':{
  es:[['Enumerar las piezas y cajas por separado de los metros cuadrados; Indique si el área es cobertura útil una vez ensamblados los paneles nominal o efectiva.','Enumere las piezas y las cajas por separado de los metros cuadrados; indique si el área corresponde a la superficie nominal o a la cobertura útil de los paneles ensamblados.']],
  'pt-br':[['Liste peças e caixas separadamente por metro quadrado; indicar se a área é de cobertura útil após o encaixe dos painéis nominal ou efetiva.','Liste peças e caixas separadamente dos metros quadrados; indique se a área corresponde à superfície nominal ou à cobertura útil após o encaixe dos painéis.']]
 },
 '05':{'pt-br':[['Pergunte aa pessoa','Pergunte à pessoa']]},
 '53':{es:[['demostrar el porro','demostrar el encaje'],['métodos de roscado','métodos de golpeo']], 'pt-br':[['métodos de rosqueamento','métodos de encaixe por batidas'],['demonstrar a articulação','demonstrar o encaixe'],['coleta anterior','coleção anterior']]},
 '55':{es:[['mueve una fila de mamparas','mueve una fila de pantallas']]}
};
const descriptions={
 '01':'A practical buyer workflow for converting an approved PVC wall-panel sample into a traceable purchase specification for Brazil.',
 '06':'Prepare a Chilean distributor warehouse for long PVC wall panels with a documented unloading, storage, identification and picking plan.',
 '12':'Help Peruvian apartment buyers distinguish SPC flooring appearance, underlay choices and product-specific evidence about sound transmission.',
 '42':'Plan WPC wall-panel end returns for Uzbekistan orders: identify exposed edges, coordinate trims and record the details needed for a quotation.',
 '46':'Align PVC wall-panel cartons, pieces and usable coverage for Uzbekistan orders so importers, dealers and installers compare the same quantities.',
 '48':'Coordinate WPC walls and separate LED channels in Uzbekistan: check access, fixing responsibilities and lighting details before ordering.',
 '49':'Plan UV marble washbasin backsplashes in Uzbekistan: document tap openings, adjoining surfaces and the installation details that need review.',
 '52':'Build a PVC wall-panel cutting map for Uzbekistan projects: compare mixed lengths, room dimensions and usable offcuts before requesting a quote.',
 '53':'Maintain SPC click demonstration samples in Uzbekistan: identify worn joints, keep sample records and distinguish demonstrations from new planks.',
 '54':'Identify the rear face of WPC wall-panel samples in Uzbekistan: compare profiles, labels and product codes before confirming the selected model.',
 '55':'Review UV marble wall reflections near office screens in Uzbekistan before ordering a glossy finish: assess lighting, viewing angles and samples.',
 '57':'Review PVC wall-panel brochure claims for Uzbekistan dealers: check wording against model-specific evidence before copying or translating a catalog.',
 '60':'Pack UV marble sheet samples for Uzbekistan buyers: protect edges and visible surfaces, identify each sample and document what needs evaluation.'
};
const titles={'43':'SPC flooring storage racks for Uzbekistan showrooms','47':'Choosing entrance mats for SPC flooring in Uzbekistan','54':'WPC sample rear-face identification in Uzbekistan','56':'Review PU stone-look panels in Uzbekistan shop windows'};
for(const row of manifest){
 const g=JSON.parse(fs.readFileSync(path.join(source,row.source)));
 const id=String(g.id).padStart(2,'0');
 const image=`review-20261106-${id}-${g.slug}.webp`;
 const bytes=fs.readFileSync(path.join(source,'assets',id+'.webp'));
 const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
 if(hashes.has(sha256))throw Error('Duplicate image '+id);hashes.add(sha256);
 const out={file:g.slug+'.html',image,product:g.product,catalog:g.catalog,source:g.sources[0].url,sourceName:g.sources[0].label,sourceScope:g.sources[0].scope,market:g.market,primaryKeyword:g.primaryKeyword,related:[]};
 for(const code of ['en','es','pt-br','ar']){
  let c=g.locales[code];if(!c)throw Error('Missing '+id+'/'+code);
  let serialized=JSON.stringify(c);
  for(const [before,after] of corrections[id]?.[code]||[]){
   if(!serialized.includes(before))throw Error('Correction no longer matches '+id+'/'+code+': '+before);
   serialized=serialized.replaceAll(before,after);
  }
  c=JSON.parse(serialized);
  if(code==='en'){
   if(descriptions[id])c.description=descriptions[id];
   if(titles[id])c.title=titles[id];
  }
  out[code]={...c,heading:c.title,sections:c.sections.map(s=>[s.heading,s.body]),faq:c.faq.map(q=>[q.question,q.answer])};
 }
 guides.push(out);
 images.push({id,file:image,sha256,original:`assets/${id}.webp`,prompt:g.imagePrompt,kind:'Editorial illustration, not verified product or project photography'});
}
if(new Set(guides.map(g=>g.file)).size!==60)throw Error('Duplicate slug');
for(let i=0;i<guides.length;i++){
 const g=guides[i];
 const family=guides.filter(x=>x.product===g.product), n=family.indexOf(g);
 g.related=[family[(n+1)%family.length],family[(n+family.length-1)%family.length],...family.filter(x=>x!==g&&x.market===g.market)].map(x=>x.file);
 g.related=[...new Set(g.related)].slice(0,3);
}
fs.writeFileSync(path.join(root,'content/review-batch-20261106.mjs'),'// One-off Desktop batch; explicit user publication approval on 2026-11-06.\nexport const date = "2026-11-06";\nexport const guides = '+JSON.stringify(guides,null,2)+';\n');
fs.writeFileSync(path.join(root,'content/review-batch-20261106-images.json'),JSON.stringify(images,null,2)+'\n');
for(const image of images)fs.copyFileSync(path.join(source,image.original),path.join(root,'assets/articles',image.file));
console.log('Imported 60 complete four-language sources and 60 distinct images. Desktop originals unchanged.');
