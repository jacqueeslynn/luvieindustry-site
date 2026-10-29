import fs from 'node:fs';
import {guides as dailyGuides} from '../content/daily-guides-20261027.mjs';
import {guides as regionalGuides} from '../content/regional-guides-20261028.mjs';
import {guides as latestGuides} from '../content/daily-guides-20261029.mjs';
const guides = [...dailyGuides, ...regionalGuides, ...latestGuides];
const labels = {
  '': ['Request product details or a quotation', 'No WhatsApp or email app needed. Use our website form to tell us what you are considering; an approximate quantity is enough to start the conversation.', 'Open online inquiry form'],
  'es/': ['Solicite detalles del producto o una cotización', 'No necesita WhatsApp ni una aplicación de correo. Use el formulario del sitio para explicar qué busca; una cantidad aproximada basta para iniciar la conversación.', 'Abrir formulario de consulta'],
  'pt-br/': ['Peça detalhes do produto ou uma cotação', 'Não precisa de WhatsApp nem aplicativo de e-mail. Use o formulário do site para explicar o que procura; uma quantidade aproximada basta para começar.', 'Abrir formulário de consulta'],
  'ar/': ['اطلب تفاصيل المنتج أو عرض سعر', 'لا تحتاج واتساب أو تطبيق بريد. استخدم نموذج الموقع لتوضيح ما تبحث عنه؛ تكفي كمية تقريبية لبدء المحادثة.', 'افتح نموذج الاستفسار'],
};
for (const [prefix, [title, text, action]] of Object.entries(labels)) {
  const home = prefix + 'index.html';
  let html = fs.readFileSync(home,'utf8');
  if (!html.includes('/assets/inquiry-path.js')) html = html.replace('</body>', '<script src="/assets/inquiry-path.js" defer></script></body>');
  fs.writeFileSync(home,html);
  const files = [...fs.readdirSync(prefix+'products').filter(f=>f.endsWith('.html')).map(f=>prefix+'products/'+f), ...guides.map(g=>prefix+'articles/'+g.file)];
  if(prefix) files.push(prefix+'contact.html');
  for(const file of files) {
    let page = fs.readFileSync(file,'utf8').replace(/<!-- online-inquiry:start -->[\s\S]*?<!-- online-inquiry:end -->/g,'');
    const url = `/${prefix}?inquiry=1&amp;from=${encodeURIComponent('/'+file)}`;
    const card = `<!-- online-inquiry:start --><section class="online-inquiry"><h2>${title}</h2><p>${text}</p><a href="${url}">${action}</a></section><!-- online-inquiry:end -->`;
    if(!page.includes('/assets/inquiry-path.css'))page=page.replace('</head>','<link rel="stylesheet" href="/assets/inquiry-path.css"></head>');
    if(!page.includes('</main>'))throw Error('Missing main: '+file);
    fs.writeFileSync(file,page.replace('</main>',card+'</main>'));
  }
}
console.log('Online inquiry paths refreshed in four languages.');
