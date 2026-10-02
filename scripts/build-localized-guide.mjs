import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://luvieindustry.com';
const variants = {
  en: '/articles/fluted-wall-panels-distributor-guide.html',
  es: '/es/articles/panel-ranurado-pvc-pared.html',
  'pt-BR': '/pt-br/articles/painel-ripado-pvc-parede.html',
  ar: '/ar/articles/fluted-pvc-wall-panels.html',
};
const translations = {
  es: {
    dir: 'ltr', title: 'Panel ranurado de PVC para pared: guía de compra | Luvie',
    desc: 'Cómo elegir paneles ranurados de PVC: compruebe material, cobertura útil, ambiente de instalación, remates y documentación antes de comprar.',
    home: 'Inicio', pvc: 'Paneles PVC', wpc: 'Paneles WPC', contact: 'Contacto', languages: 'Idioma del artículo',
    h1: 'Panel ranurado de PVC para pared: cómo elegir sin comprar solo por la foto',
    lead: 'Antes de comparar precios, confirme la composición del modelo, la cobertura útil, el lugar donde se instalará y los remates necesarios.',
    photo: 'Muestra de un perfil decorativo ranurado. Confirme el material y el SKU antes de relacionar esta imagen con una cotización.',
    sections: [
      ['¿Panel ranurado significa panel de PVC?', 'No siempre. «Ranurado» describe el relieve, no la composición. PVC, WPC y otras familias pueden parecer similares en una foto, pero tener perfiles, fijaciones y usos distintos. Solicite el nombre exacto del producto, su sección transversal, espesor, anchura total y útil, longitud y referencia de acabado. Una imagen no sustituye una muestra física.'],
      ['¿Dónde puede instalarse?', 'En una pared decorativa de una tienda o recepción importan el dibujo, las uniones y los remates. En cocina o baño también cuentan salpicaduras, ventilación, estado de la base, juntas y penetraciones. La resistencia a la humedad de la superficie no convierte todo el muro en un sistema impermeable. Para zonas mojadas, siga las instrucciones del modelo elegido, no una afirmación genérica sobre el PVC.'],
      ['¿Cómo comparar el precio por metro cuadrado?', 'Use la anchura útil después del encaje multiplicada por la longitud utilizable para obtener la cobertura de una pieza. Divida el precio por esa superficie y añada perfiles, adhesivos o fijaciones, merma, embalaje, transporte, impuestos e instalación cuando correspondan. Por ejemplo, una pieza que cubre 0,40 m² exige al menos 25 piezas para 10 m² antes de recortes. Es solo una operación matemática, no una medida de producto Luvie.'],
      ['¿Qué pedir antes de cerrar el pedido?', 'Pida una muestra y ficha del SKU exacto, dibujo de las uniones, anchura útil, instrucciones de instalación, remates compatibles, referencia de lote y protección para transporte. Si su proyecto exige ensayos, compruebe que el informe mencione el producto y la configuración pertinentes. Confirme precio, pedido mínimo, plazo y documentación en una oferta escrita para el país de destino.'],
    ],
    evidence: 'El guía de instalación de ACP Professional ilustra por qué la base y el sellado dependen de la exposición. Es una referencia externa, no una certificación de productos Luvie.',
    catalog: 'Abrir catálogo de paneles de pared (PDF)', source: 'Ver referencia técnica externa', cta: 'Enviar aplicación, país y cantidad por WhatsApp', footer: 'La selección final debe basarse en el producto y su documentación específicos.',
  },
  ar: {
    dir: 'rtl', title: 'ألواح PVC المخددة للجدران: دليل اختيار للمستوردين | Luvie',
    desc: 'كيف تختار ألواح الجدران المخددة من PVC بعد التحقق من المادة ومساحة التغطية ومكان التركيب والحواف والوثائق.',
    home: 'الرئيسية', pvc: 'ألواح PVC', wpc: 'ألواح WPC', contact: 'تواصل معنا', languages: 'لغة المقال',
    h1: 'ألواح PVC المخددة للجدران: كيف تختار بعيداً عن الصورة وحدها؟',
    lead: 'قبل مقارنة الأسعار، تأكد من مادة الطراز ومساحة التغطية الفعلية ومكان التركيب وملحقات التشطيب.',
    photo: 'عينة لقطاع لوح زخرفي مخدد. تحقق من المادة ورمز المنتج قبل ربط الصورة بعرض سعر.',
    sections: [
      ['هل يعني اللوح المخدد أنه مصنوع من PVC؟', 'ليس بالضرورة. تصف كلمة «مخدد» شكل السطح ولا تحدد المادة. قد تبدو ألواح PVC وWPC ومواد أخرى متشابهة في الصور، مع اختلاف المقطع وطريقة التثبيت والاستخدام المقصود. اطلب رمز الطراز وتركيبه وسماكته والعرض الكلي والعرض الفعلي بعد التعشيق والطول ومرجع التشطيب. لا تعتمد على الصورة بدلاً من العينة الفعلية.'],
      ['أين يمكن تركيبه؟', 'في جدار زخرفي لمتجر أو استقبال تهم هيئة الخطوط والفواصل والحواف. أما في المطبخ أو الحمام فيجب تقييم الرذاذ والتهوية وحالة القاعدة والوصلات والفتحات. مقاومة سطح اللوح للرطوبة لا تجعل نظام الجدار كاملاً مقاوماً للماء. اتبع تعليمات الطراز المختار في الأماكن المبللة، ولا تعتمد على ادعاء عام عن PVC.'],
      ['كيف تقارن السعر لكل متر مربع؟', 'احسب مساحة تغطية القطعة من العرض الفعلي بعد التعشيق مضروباً في الطول القابل للاستخدام. ثم أضف تكلفة الحواف ومواد التثبيت والهدر والتغليف والشحن والضرائب والتركيب حيث تنطبق. مثال حسابي فقط: إذا غطت القطعة 0.40 متر مربع فستحتاج إلى 25 قطعة على الأقل لجدار مساحته 10 أمتار مربعة قبل القص والفتحات. هذا ليس مقاساً لمنتج من Luvie.'],
      ['ماذا تطلب من المورد قبل الشراء؟', 'اطلب عينة ومواصفات الطراز المحدد ورسم التعشيق والعرض الفعلي وتعليمات التركيب والحواف المتوافقة ومرجع الدفعة وحماية النقل. إذا تطلب المشروع تقارير اختبار، فتأكد من مطابقة المنتج وطريقة تركيبه لما ورد في التقرير. أكد السعر والحد الأدنى والمهلة والوثائق في عرض مكتوب لبلد الوصول.'],
    ],
    evidence: 'يوضح دليل التركيب من ACP Professional سبب اختلاف متطلبات القاعدة والعزل حسب التعرض للماء. وهو مرجع خارجي لا يُعد شهادة لمنتجات Luvie.',
    catalog: 'فتح كتالوج ألواح الجدران (PDF)', source: 'فتح المرجع الفني الخارجي', cta: 'أرسل الاستخدام والبلد والكمية عبر واتساب', footer: 'يعتمد القرار النهائي على الطراز المحدد ووثائقه.',
  },
};
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const pixel = `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1331142262420820');fbq('track','PageView');</script>`;
const alternateTags = Object.entries(variants).map(([language, route]) => `<link rel="alternate" hreflang="${language}" href="${base}${route}">`).join('');
const languageNav = (current, label) => `<nav class="languages" aria-label="${escape(label)}">${Object.entries(variants).map(([language, route]) => `<a href="${route}" lang="${language}"${language === current ? ' aria-current="page"' : ''}>${language === 'en' ? 'English' : language === 'es' ? 'Español' : language === 'pt-BR' ? 'Português (Brasil)' : 'العربية'}</a>`).join('')}</nav>`;

for (const [language, data] of Object.entries(translations)) {
  const route = variants[language];
  const body = `<!doctype html><html lang="${language}" dir="${data.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(data.title)}</title><meta name="description" content="${escape(data.desc)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${base}${route}">${alternateTags}<link rel="icon" href="/assets/brand/favicon-32.png"><link rel="stylesheet" href="/assets/localized.css"><meta property="og:type" content="article"><meta property="og:title" content="${escape(data.title)}"><meta property="og:description" content="${escape(data.desc)}"><meta property="og:url" content="${base}${route}"><meta property="og:image" content="${base}/assets/quote-product-images/image6.jpeg"><meta property="article:published_time" content="2026-10-03"><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: data.h1, description: data.desc, inLanguage: language, datePublished: '2026-10-03', author: { '@type': 'Organization', name: 'Luvie Industry' }, image: `${base}/assets/quote-product-images/image6.jpeg`, mainEntityOfPage: `${base}${route}` })}</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VCLMP6Q5KJ');</script></head><body><header class="site-header"><div class="wrap header-row"><a class="brand" href="/${language}/"><img src="/assets/brand/luvie-logo.webp" width="52" height="52" alt="Luvie Industry">LUVIE INDUSTRY</a><nav class="main-nav"><a href="/${language}/">${data.home}</a><a href="/${language}/products/pvc-wall-panels.html">${data.pvc}</a><a href="/${language}/products/wpc-wall-panels.html">${data.wpc}</a><a href="/${language}/contact.html">${data.contact}</a></nav></div><div class="wrap">${languageNav(language, data.languages)}</div></header><main class="wrap section guide"><article><h1>${escape(data.h1)}</h1><p class="lead">${escape(data.lead)}</p><figure><img src="/assets/quote-product-images/image6.jpeg" alt="" width="1279" height="1706"><figcaption>${escape(data.photo)}</figcaption></figure>${data.sections.map(([heading, paragraph]) => `<section><h2>${escape(heading)}</h2><p>${escape(paragraph)}</p></section>`).join('')}<section class="callout"><p>${escape(data.evidence)}</p><a href="https://acp-professional.com/wall-panels/wall-panel-installation-guides/palisade-panel-installation-guide/" rel="noopener noreferrer external" target="_blank">${escape(data.source)}</a></section><div class="actions"><a class="button" href="/assets/catalogs/dream-house-wall-panel-catalog.pdf">${escape(data.catalog)}</a><a class="button outline" href="https://wa.me/306947135317">${escape(data.cta)}</a></div></article></main><footer class="footer"><div class="wrap"><p>${escape(data.footer)}</p><p><a href="mailto:jinsburg@luvieindustry.com">jinsburg@luvieindustry.com</a> · <a href="https://wa.me/306947135317" dir="ltr">+30 6947135317</a></p></div></footer></body></html>\n`;
  const file = path.join(root, route.slice(1));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body.replace('</head>', `${pixel}</head>`));
}
console.log('Built Spanish and Arabic localized buyer guides.');
