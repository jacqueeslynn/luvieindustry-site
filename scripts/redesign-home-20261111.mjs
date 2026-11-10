import fs from 'node:fs';
import {families,labels,locales} from '../content/product-series.mjs';
const captions={en:'Application illustration · not a documented customer project',es:'Ilustración de aplicación · no es un proyecto de cliente documentado','pt-br':'Ilustração de aplicação · não é um projeto documentado de cliente',ar:'تصور للاستخدام · ليس مشروع عميل موثقاً'};
for(const l of locales){const prefix=l==='en'?'':l+'/';const file=prefix+'index.html';let h=fs.readFileSync(file,'utf8');
 h=h.replace(/<div class="hero-media">[\s\S]*?<\/div>/,`<div class="hero-media"><img src="/assets/extracted_from_pdf/p01_02_Im16.jpg" width="1024" height="1293" fetchpriority="high" alt="${captions[l]}"><p class="profile-caption">${captions[l]}</p></div>`);
 h=h.replace(/<!-- home-families:start -->[\s\S]*?<!-- home-families:end -->/,'');
 h=h.replace('<section aria-labelledby="latest-guides-title"',`<!-- home-families:start --><section class="home-families"><div class="home-families-heading"><span>01 / LUVIE</span><h2>${labels[l].series}</h2></div><div class="home-family-grid">${families.map((f,i)=>`<a href="/${prefix}products/${f.id}.html"><span>0${i+1}</span><h3>${f.name[l]}</h3><b aria-hidden="true">↗</b></a>`).join('')}</div></section><!-- home-families:end --><section aria-labelledby="latest-guides-title"`);
 if(!h.includes('/assets/home-renewal.css'))h=h.replace('</head>','<link rel="stylesheet" href="/assets/home-renewal.css"></head>');fs.writeFileSync(file,h);
}
