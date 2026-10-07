import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// One table per product-family page; make narrow tables discoverable and keyboard-scrollable.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labels = {
  en: { region: 'Product details table', hint: 'Scroll sideways to see every column ↔' },
  es: { region: 'Tabla de detalles del producto', hint: 'Desliza horizontalmente para ver todas las columnas ↔' },
  'pt-br': { region: 'Tabela de detalhes do produto', hint: 'Deslize para os lados para ver todas as colunas ↔' },
  ar: { region: 'جدول تفاصيل المنتج', hint: 'مرّر أفقياً لرؤية جميع الأعمدة ↔' },
};
const families = ['pvc-wall-panels', 'wpc-wall-panels'];
const englishFamilies = ['fluted-wall-panels', 'pu-stone-panels', 'spc-flooring', 'uv-marble-sheets', ...families];
let changed = 0;
for (const [locale, familyNames] of [
  ['en', englishFamilies], ['es', families], ['pt-br', families], ['ar', families],
]) {
  for (const family of familyNames) {
    const relative = locale === 'en' ? 'products/' + family + '.html' : locale + '/products/' + family + '.html';
    const file = path.join(root, relative);
    const source = fs.readFileSync(file, 'utf8');
    const count = source.split('<div class="table-wrap">').length - 1;
    if (count !== 1) throw new Error(relative + ': expected one unmodified table, found ' + count);
    const { region, hint } = labels[locale];
    const marker = '<p class="table-scroll-hint">' + hint + '</p><div class="table-wrap" role="region" aria-label="' + region + '" tabindex="0">';
    fs.writeFileSync(file, source.replace('<div class="table-wrap">', marker));
    changed++;
  }
}
for (const locale of ['es', 'pt-br', 'ar']) {
  const file = path.join(root, 'content/translations/' + locale + '.json');
  const cache = JSON.parse(fs.readFileSync(file, 'utf8'));
  cache[labels.en.region] = labels[locale].region;
  cache[labels.en.hint] = labels[locale].hint;
  fs.writeFileSync(file, JSON.stringify(cache, null, 2) + '\n');
}
console.log('Added accessible table hints to ' + changed + ' product pages.');
