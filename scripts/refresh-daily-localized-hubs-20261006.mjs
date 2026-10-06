import fs from 'node:fs';

const date = '2026-10-06';
const files = [
  'brazil-pvc-ceiling-panel-import-documents.html',
  'gulf-hotel-decorative-wall-condensation.html',
  'uzbekistan-wall-panels-winter-delivery.html',
];

for (const locale of ['es', 'pt-br', 'ar']) {
  const target = `${locale}/articles/index.html`;
  let html = fs.readFileSync(target, 'utf8');
  html = html.replace(/(<meta content=")[^"]+(" name="last-modified"\/>)/, `$1${date}$2`);
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, json) => {
    const schema = JSON.parse(json);
    const collection = schema['@graph'].find((item) => item['@type'] === 'CollectionPage');
    const list = schema['@graph'].find((item) => item['@type'] === 'ItemList');
    collection.dateModified = date;
    for (const file of files) {
      const url = `https://luvieindustry.com/${locale}/articles/${file}`;
      if (list.itemListElement.some((entry) => entry.url === url)) continue;
      const article = fs.readFileSync(`${locale}/articles/${file}`, 'utf8');
      const name = article.match(/<h1>([^<]+)<\/h1>/)?.[1];
      if (!name) throw new Error(`Missing heading in ${locale}/articles/${file}`);
      list.itemListElement.push({ '@type': 'ListItem', position: list.itemListElement.length + 1, name, url });
    }
    list.numberOfItems = list.itemListElement.length;
    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  });
  fs.writeFileSync(target, html);
}
console.log('Updated localized hub schema and modified dates.');
