import fs from 'node:fs';
export const date='2026-11-15';
export const guides=['brazil','uae','uzbekistan'].map(country=>JSON.parse(fs.readFileSync(new URL(`./nov15-${country}-draft.json`,import.meta.url),'utf8')));
const file=new URL('./daily-guides-20261115-translations.json',import.meta.url);
if(fs.existsSync(file)){const translated=JSON.parse(fs.readFileSync(file,'utf8'));for(const g of guides)for(const lang of ['es','pt-br','ar'])if(translated[g.file+':'+lang])g[lang]=translated[g.file+':'+lang];}
