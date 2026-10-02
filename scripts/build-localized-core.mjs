import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://luvieindustry.com';
const today = '2026-10-03';
const locales = {
  es: {
    html: 'es', dir: 'ltr', name: 'Español', nav: ['Inicio', 'Paneles de PVC', 'Paneles WPC', 'Contacto'],
    home: {
      title: 'Paneles de pared PVC y WPC para importadores | Luvie',
      desc: 'Explore paneles decorativos PVC y WPC, catálogos y una ruta clara para solicitar muestras y especificaciones del producto exacto.',
      eyebrow: 'Materiales decorativos para distribuidores y proyectos',
      h1: 'Paneles de pared PVC y WPC para su mercado',
      intro: 'Compare materiales, perfiles y acabados antes de pedir un precio. Luvie ayuda a importadores y compradores de proyectos a seleccionar modelos, muestras y documentación para cada pedido.',
      section: 'Elija una familia de productos',
      pvc: 'Paneles de PVC', pvcText: 'Para paredes decorativas y renovaciones interiores. Compruebe el perfil, la cobertura útil, los remates y las condiciones de instalación.',
      wpc: 'Paneles WPC', wpcText: 'Diferencie los modelos decorativos de interior de los productos destinados a exposición exterior. Confirme fijación y documentos del modelo.',
      process: 'Del catálogo a una consulta útil', steps: ['Indique país, uso y medidas aproximadas.', 'Seleccione acabados en el catálogo y solicite muestras.', 'Confirme el SKU, sus accesorios y las condiciones del pedido por escrito.'],
      catalogs: 'Catálogos de productos', catalogNote: 'Los PDF originales pueden contener texto en inglés. Solicite ayuda en español para identificar el modelo correcto.',
      contact: 'Pida una recomendación para su proyecto', contactText: 'Comparta destino, aplicación, cantidad estimada y acabado preferido. Confirmaremos las opciones y los documentos disponibles para el producto concreto.',
    },
    pvc: {
      title: 'Paneles de pared PVC: guía de compra | Luvie', desc: 'Compare perfiles, cobertura útil, acabados y accesorios de paneles PVC antes de solicitar una cotización.',
      h1: 'Paneles de pared PVC para importadores', intro: 'El nombre del material no basta para elegir un panel. Empiece por el uso previsto y después confirme el modelo, el encaje, la cobertura y la instalación.',
      questions: ['¿Dónde se instalará?', '¿Qué dimensiones necesita confirmar?', '¿Qué debe pedir antes de comprar?'],
      answers: [
        'Una pared decorativa, una habitación completa y una zona húmeda requieren detalles distintos. La resistencia de la cara del panel a la humedad no convierte por sí sola toda la pared en un sistema impermeable. Revise base, juntas, bordes y ventilación según el producto.',
        'Solicite anchura total y anchura útil después del encaje, longitud utilizable, espesor, sección transversal, acabado y remates compatibles. Calcule la cantidad con la cobertura instalada, no solo con el ancho nominal.',
        'Pida una muestra física del SKU exacto, el dibujo del perfil, las instrucciones de fijación y los documentos exigidos en el país de destino. Confirme precio, pedido mínimo, plazo y embalaje en la cotización específica.',
      ],
      catalog: 'Abrir catálogo de paneles de pared (PDF)', imageAlt: 'Portada del catálogo de paneles PVC de Luvie',
    },
    wpc: {
      title: 'Paneles WPC para pared: interior y exterior | Luvie', desc: 'Distinga los paneles WPC decorativos de interior de los productos para exposición exterior y compare perfiles y fijación.',
      h1: 'Paneles WPC: elija el sistema según el lugar', intro: 'Un acabado similar no significa que dos perfiles WPC puedan usarse en las mismas condiciones. Defina el entorno antes de seleccionar un modelo.',
      questions: ['Interior o exposición exterior', 'Compare el perfil completo', 'Prepare una consulta verificable'],
      answers: [
        'Los paneles decorativos de interior se seleccionan por su apariencia y detalles de montaje. Un proyecto exterior exige revisar sol, lluvia, drenaje, ventilación, movimiento y fijación. No atribuya aptitud exterior a un modelo sin documentación del SKU.',
        'Compare la anchura útil tras el encaje, longitud, peso, acabado, estructura de soporte y remates. Una muestra conectada y un dibujo acotado ayudan a calcular cobertura y accesorios.',
        'Envíe país, uso interior o exterior, fotos o plano de la pared, acabado y cantidad aproximada. Solicite instrucciones de instalación, embalaje y ensayos aplicables al modelo concreto. Precio y plazo se confirman por pedido.',
      ],
      catalog: 'Abrir colección WPC (PDF)', imageAlt: 'Portada del catálogo WPC de Luvie',
    },
    contact: {
      title: 'Contacto y solicitud de producto | Luvie', desc: 'Envíe a Luvie los datos de su proyecto de paneles PVC o WPC y solicite catálogo, muestras y especificaciones.',
      h1: 'Hable con Luvie sobre su proyecto', intro: 'Podemos orientar la selección del producto si nos indica el mercado, el uso y la cantidad aproximada. No necesita adivinar el SKU a partir de una fotografía.',
      needed: 'Incluya estos datos', items: ['País de destino y tipo de comprador', 'Aplicación: interior, zona húmeda o exterior', 'Medidas o plano y cantidad estimada', 'Familia de producto, acabado o foto de referencia', 'Documentos o normas que exige su proyecto'],
      email: 'Enviar consulta por correo', whatsapp: 'Escribir por WhatsApp', note: 'El precio, pedido mínimo, plazo y certificaciones se confirman para el modelo y pedido concretos.',
    },
    common: { explore: 'Ver detalles', quote: 'Consultar producto', contact: 'Contactar', catalog: 'Ver catálogo', more: 'Guías disponibles', disclaimer: 'Las imágenes y catálogos sirven para seleccionar referencias; confirme el modelo exacto y sus documentos antes del pedido.', footer: 'Luvie Industry · Materiales de construcción para socios internacionales' },
  },
  'pt-br': {
    html: 'pt-BR', dir: 'ltr', name: 'Português (Brasil)', nav: ['Início', 'Painéis de PVC', 'Painéis WPC', 'Contato'],
    home: {
      title: 'Painéis de parede PVC e WPC para importadores | Luvie', desc: 'Conheça painéis decorativos PVC e WPC, catálogos e o caminho para pedir amostras e especificações do produto exato.',
      eyebrow: 'Materiais decorativos para distribuidores e projetos', h1: 'Painéis de parede PVC e WPC para o seu mercado',
      intro: 'Compare materiais, perfis e acabamentos antes de pedir um preço. A Luvie ajuda importadores e compradores de projetos a selecionar modelos, amostras e documentos para cada pedido.',
      section: 'Escolha uma linha de produtos', pvc: 'Painéis de PVC', pvcText: 'Para paredes decorativas e reformas internas. Confirme perfil, cobertura útil, acabamentos de borda e condições de instalação.',
      wpc: 'Painéis WPC', wpcText: 'Separe os modelos decorativos de interior dos produtos destinados à exposição externa. Confirme fixação e documentação do modelo.',
      process: 'Do catálogo a uma consulta útil', steps: ['Informe país, aplicação e medidas aproximadas.', 'Escolha acabamentos no catálogo e solicite amostras.', 'Confirme o SKU, acessórios e condições do pedido por escrito.'],
      catalogs: 'Catálogos de produtos', catalogNote: 'Os PDFs originais podem conter textos em inglês. Peça ajuda em português para identificar o modelo certo.',
      contact: 'Peça uma indicação para seu projeto', contactText: 'Envie destino, aplicação, quantidade estimada e acabamento desejado. Confirmaremos opções e documentos disponíveis para o produto específico.',
    },
    pvc: {
      title: 'Painéis de parede PVC: guia de compra | Luvie', desc: 'Compare perfis, cobertura útil, acabamentos e acessórios de painéis PVC antes de pedir uma cotação.',
      h1: 'Painéis de parede PVC para importadores', intro: 'O nome do material não basta para escolher um painel. Comece pelo uso previsto e confirme modelo, encaixe, cobertura e instalação.',
      questions: ['Onde o painel será instalado?', 'Quais medidas devem ser confirmadas?', 'O que pedir antes de comprar?'],
      answers: [
        'Uma parede de destaque, uma reforma completa e uma área úmida exigem detalhes diferentes. A resistência à umidade da face não transforma, por si só, toda a parede em um sistema impermeável. Confira base, juntas, bordas e ventilação conforme o produto.',
        'Peça largura total e largura útil após o encaixe, comprimento utilizável, espessura, corte transversal, acabamento e perfis de arremate. Calcule a quantidade pela cobertura instalada, não apenas pela largura nominal.',
        'Solicite amostra física do SKU exato, desenho do perfil, instruções de fixação e documentos exigidos no país de destino. Confirme preço, pedido mínimo, prazo e embalagem na cotação específica.',
      ],
      catalog: 'Abrir catálogo de painéis de parede (PDF)', imageAlt: 'Capa do catálogo de painéis PVC da Luvie',
    },
    wpc: {
      title: 'Painéis WPC para parede: interior e exterior | Luvie', desc: 'Diferencie painéis WPC decorativos de interior de produtos para exposição externa e compare perfil e fixação.',
      h1: 'Painéis WPC: escolha o sistema pelo ambiente', intro: 'Acabamentos semelhantes não significam que dois perfis WPC possam ser usados nas mesmas condições. Defina o ambiente antes de selecionar o modelo.',
      questions: ['Interior ou exposição externa', 'Compare o perfil completo', 'Prepare uma consulta verificável'],
      answers: [
        'Painéis decorativos internos são escolhidos pela aparência e pelos detalhes de montagem. Um projeto externo exige avaliar sol, chuva, drenagem, ventilação, movimentação e fixação. Não atribua uso externo a um modelo sem documentação do SKU.',
        'Compare largura útil após o encaixe, comprimento, peso, acabamento, estrutura de apoio e arremates. Uma amostra encaixada e um desenho com medidas ajudam a calcular cobertura e acessórios.',
        'Envie país, uso interno ou externo, fotos ou planta da parede, acabamento e quantidade aproximada. Peça instruções de instalação, embalagem e ensaios aplicáveis ao modelo específico. Preço e prazo são confirmados por pedido.',
      ],
      catalog: 'Abrir coleção WPC (PDF)', imageAlt: 'Capa do catálogo WPC da Luvie',
    },
    contact: {
      title: 'Contato e solicitação de produto | Luvie', desc: 'Envie à Luvie os dados do seu projeto de painéis PVC ou WPC e peça catálogo, amostras e especificações.',
      h1: 'Converse com a Luvie sobre seu projeto', intro: 'Podemos orientar a seleção do produto quando você informa o mercado, a aplicação e a quantidade aproximada. Não é preciso adivinhar o SKU pela foto.',
      needed: 'Inclua estas informações', items: ['País de destino e tipo de comprador', 'Aplicação: interna, área úmida ou externa', 'Medidas ou planta e quantidade estimada', 'Linha de produto, acabamento ou foto de referência', 'Documentos ou normas exigidos pelo projeto'],
      email: 'Enviar consulta por e-mail', whatsapp: 'Conversar pelo WhatsApp', note: 'Preço, pedido mínimo, prazo e certificações precisam ser confirmados para o modelo e pedido específicos.',
    },
    common: { explore: 'Ver detalhes', quote: 'Consultar produto', contact: 'Contato', catalog: 'Ver catálogo', more: 'Guias disponíveis', disclaimer: 'Imagens e catálogos ajudam a selecionar referências; confirme o modelo exato e seus documentos antes do pedido.', footer: 'Luvie Industry · Materiais de construção para parceiros internacionais' },
  },
  ar: {
    html: 'ar', dir: 'rtl', name: 'العربية', nav: ['الرئيسية', 'ألواح PVC', 'ألواح WPC', 'تواصل معنا'],
    home: {
      title: 'ألواح جدران PVC وWPC للمستوردين | Luvie', desc: 'تعرّف على ألواح الجدران الزخرفية من PVC وWPC والكتالوجات وطريقة طلب العينات ومواصفات الطراز المحدد.',
      eyebrow: 'مواد تشطيب للموزعين والمشاريع', h1: 'ألواح جدران PVC وWPC لسوقك',
      intro: 'قارن المواد والقطاعات والتشطيبات قبل طلب السعر. تساعد Luvie المستوردين ومشتري المشاريع في اختيار الطرازات والعينات والمستندات المناسبة لكل طلب.',
      section: 'اختر فئة المنتج', pvc: 'ألواح جدران PVC', pvcText: 'للجدران الزخرفية وتجديد المساحات الداخلية. تحقق من القطاع ومساحة التغطية الفعلية والحواف وظروف التركيب.',
      wpc: 'ألواح جدران WPC', wpcText: 'ميّز بين الطرازات الزخرفية الداخلية والمنتجات المخصصة للتعرض الخارجي. تأكد من طريقة التثبيت ووثائق الطراز.',
      process: 'من الكتالوج إلى استفسار واضح', steps: ['حدد بلد الوصول والاستخدام والأبعاد التقريبية.', 'اختر التشطيبات من الكتالوج واطلب العينات.', 'أكد رمز المنتج والملحقات وشروط الطلب كتابياً.'],
      catalogs: 'كتالوجات المنتجات', catalogNote: 'قد تحتوي ملفات PDF الأصلية على نصوص إنجليزية. اطلب المساعدة بالعربية لتحديد الطراز الصحيح.',
      contact: 'اطلب ترشيحاً لمشروعك', contactText: 'أرسل بلد الوصول والاستخدام والكمية التقريبية والتشطيب المفضل. سنراجع الخيارات والوثائق المتاحة للمنتج المحدد.',
    },
    pvc: {
      title: 'ألواح جدران PVC: دليل الشراء | Luvie', desc: 'قارن القطاعات ومساحة التغطية الفعلية والتشطيبات وملحقات ألواح PVC قبل طلب عرض السعر.',
      h1: 'ألواح جدران PVC للمستوردين', intro: 'اسم المادة وحده لا يكفي لاختيار اللوح. ابدأ بالاستخدام المقصود ثم تأكد من الطراز وطريقة التعشيق والتغطية والتركيب.',
      questions: ['أين سيُركّب اللوح؟', 'ما الأبعاد التي يجب تأكيدها؟', 'ماذا تطلب قبل الشراء؟'],
      answers: [
        'تختلف تفاصيل جدار الزينة عن تجديد غرفة كاملة أو مساحة رطبة. مقاومة سطح اللوح للرطوبة لا تجعل نظام الجدار كله مقاوماً للماء تلقائياً. راجع القاعدة والفواصل والحواف والتهوية بحسب المنتج المحدد.',
        'اطلب العرض الكلي والعرض الفعلي بعد التعشيق والطول القابل للاستخدام والسماكة والمقطع العرضي والتشطيب وملحقات الحواف. احسب الكمية وفق مساحة التغطية المركبة، لا العرض الاسمي فقط.',
        'اطلب عينة فعلية من الطراز المحدد ورسم القطاع وتعليمات التثبيت والمستندات المطلوبة في بلد الوصول. أكد السعر والحد الأدنى للطلب والمدة والتغليف في عرض السعر الخاص بطلبك.',
      ],
      catalog: 'فتح كتالوج ألواح الجدران (PDF)', imageAlt: 'غلاف كتالوج ألواح PVC من Luvie',
    },
    wpc: {
      title: 'ألواح جدران WPC للداخل والخارج | Luvie', desc: 'ميّز بين ألواح WPC الزخرفية الداخلية والمنتجات المخصصة للخارج وقارن القطاعات وطرق التثبيت.',
      h1: 'ألواح WPC: اختر النظام حسب الموقع', intro: 'تشابه المظهر لا يعني إمكانية استخدام قطاعين من WPC في الظروف نفسها. حدد البيئة أولاً ثم اختر الطراز.',
      questions: ['استخدام داخلي أم تعرض خارجي؟', 'قارن القطاع كاملاً', 'أعد استفساراً قابلاً للتحقق'],
      answers: [
        'تُختار الألواح الزخرفية الداخلية وفق المظهر وتفاصيل التركيب. أما المشروع الخارجي فيتطلب فحص الشمس والمطر والتصريف والتهوية والتمدد والتثبيت. لا تفترض ملاءمة طراز للخارج من دون وثائق خاصة به.',
        'قارن العرض الفعلي بعد التعشيق والطول والوزن والتشطيب والدعامات والحواف. تساعد العينة المركبة والرسم ذو الأبعاد في حساب التغطية والملحقات.',
        'أرسل البلد ومكان الاستخدام وصور الجدار أو مخططه والتشطيب والكمية التقريبية. اطلب تعليمات التركيب والتغليف وتقارير الاختبار الخاصة بالطراز إن لزم. يُؤكد السعر والموعد لكل طلب.',
      ],
      catalog: 'فتح مجموعة WPC (PDF)', imageAlt: 'غلاف كتالوج منتجات WPC من Luvie',
    },
    contact: {
      title: 'التواصل وطلب معلومات المنتج | Luvie', desc: 'أرسل تفاصيل مشروع ألواح PVC أو WPC إلى Luvie واطلب الكتالوج والعينات والمواصفات.',
      h1: 'تواصل مع Luvie بشأن مشروعك', intro: 'يمكننا مساعدتك في اختيار المنتج عندما تذكر السوق والاستخدام والكمية التقريبية. لا حاجة إلى تخمين الطراز من الصورة.',
      needed: 'أرسل هذه المعلومات', items: ['بلد الوصول ونوع المشتري', 'الاستخدام: داخلي أو مساحة رطبة أو خارجي', 'الأبعاد أو المخطط والكمية التقريبية', 'فئة المنتج والتشطيب أو صورة مرجعية', 'المستندات أو المعايير المطلوبة للمشروع'],
      email: 'إرسال استفسار بالبريد', whatsapp: 'مراسلتنا عبر واتساب', note: 'يجب تأكيد السعر والحد الأدنى للطلب والمدة والشهادات للطراز والطلب المحددين.',
    },
    common: { explore: 'عرض التفاصيل', quote: 'الاستفسار عن المنتج', contact: 'تواصل معنا', catalog: 'عرض الكتالوج', more: 'الأدلة المتاحة', disclaimer: 'تساعد الصور والكتالوجات في اختيار المراجع؛ أكد الطراز المحدد ووثائقه قبل الطلب.', footer: 'Luvie Industry · مواد بناء للشركاء الدوليين' },
  },
};

const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const pixel = `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1331142262420820');fbq('track','PageView');</script>`;
const pagePath = (locale, page) => page === 'home' ? `/${locale}/` : `/${locale}/${page === 'contact' ? 'contact.html' : `products/${page}-wall-panels.html`}`;
const englishPath = (page) => page === 'home' ? '/' : page === 'contact' ? null : `/products/${page}-wall-panels.html`;
const switches = (page, current) => {
  const choices = [['en', 'English', englishPath(page)], ...Object.entries(locales).map(([code, value]) => [code, value.name, pagePath(code, page)])];
  return `<nav class="languages" aria-label="Language"><span class="sr-only">Language:</span>${choices.filter(([, , url]) => url).map(([code, label, url]) => `<a href="${url}" hreflang="${code === 'en' ? 'en' : locales[code].html}" lang="${code === 'en' ? 'en' : locales[code].html}"${code === current ? ' aria-current="page"' : ''}>${escape(label)}</a>`).join('')}</nav>`;
};
const alternates = (page) => [['en', englishPath(page)], ...Object.keys(locales).map((code) => [locales[code].html, pagePath(code, page)])].filter(([, url]) => url).map(([code, url]) => `<link rel="alternate" hreflang="${code}" href="${base}${url}">`).join('');
const nav = (code, data, page) => `<header class="site-header"><div class="wrap header-row"><a class="brand" href="/${code}/"><img src="/assets/brand/luvie-logo.webp" alt="Luvie Industry" width="52" height="52"><span>LUVIE INDUSTRY</span></a><nav class="main-nav" aria-label="Navigation"><a href="/${code}/"${page === 'home' ? ' aria-current="page"' : ''}>${data.nav[0]}</a><a href="/${code}/products/pvc-wall-panels.html"${page === 'pvc' ? ' aria-current="page"' : ''}>${data.nav[1]}</a><a href="/${code}/products/wpc-wall-panels.html"${page === 'wpc' ? ' aria-current="page"' : ''}>${data.nav[2]}</a><a href="/${code}/contact.html"${page === 'contact' ? ' aria-current="page"' : ''}>${data.nav[3]}</a></nav></div><div class="wrap">${switches(page, code)}</div></header>`;
const emailLink = (subject) => `mailto:jinsburg@luvieindustry.com?subject=${encodeURIComponent(subject)}`;
const shell = (code, data, page, body, image) => {
  const route = pagePath(code, page);
  const info = data[page];
  const schema = { '@context': 'https://schema.org', '@type': page === 'contact' ? 'ContactPage' : page === 'home' ? 'WebPage' : 'CollectionPage', name: info.h1, inLanguage: data.html, url: `${base}${route}`, description: info.desc, publisher: { '@type': 'Organization', name: 'Luvie Industry', url: `${base}/` } };
  return `<!doctype html><html lang="${data.html}" dir="${data.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(info.title)}</title><meta name="description" content="${escape(info.desc)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${base}${route}">${alternates(page)}<link rel="icon" href="/assets/brand/favicon-32.png"><link rel="stylesheet" href="/assets/localized.css"><meta property="og:type" content="website"><meta property="og:title" content="${escape(info.title)}"><meta property="og:description" content="${escape(info.desc)}"><meta property="og:url" content="${base}${route}"><meta property="og:image" content="${base}${image}"><script type="application/ld+json">${JSON.stringify(schema)}</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VCLMP6Q5KJ');</script></head><body>${nav(code, data, page)}<main>${body}</main><footer class="footer"><div class="wrap"><p>${escape(data.common.footer)}</p><p><a href="mailto:jinsburg@luvieindustry.com">jinsburg@luvieindustry.com</a> · <a href="https://wa.me/306947135317" dir="ltr">+30 6947135317</a></p><p class="fine">${escape(data.common.disclaimer)}</p></div></footer></body></html>\n`;
};
const productCard = (code, title, text, kind, img, label) => `<a class="card" href="/${code}/products/${kind}-wall-panels.html"><img src="${img}" alt="${escape(title)}" loading="lazy"><div><h3>${escape(title)}</h3><p>${escape(text)}</p><strong>${escape(label)} →</strong></div></a>`;
const homeBody = (code, data) => `<section class="hero"><div class="wrap hero-grid"><div><span class="eyebrow">${escape(data.home.eyebrow)}</span><h1>${escape(data.home.h1)}</h1><p class="lead">${escape(data.home.intro)}</p><div class="actions"><a class="button" href="/${code}/products/pvc-wall-panels.html">${escape(data.home.pvc)}</a><a class="button outline" href="/${code}/contact.html">${escape(data.common.contact)}</a></div></div><img class="hero-image" src="/assets/quote-product-images/image6.jpeg" alt="" width="900" height="600"></div></section><section class="wrap section"><h2>${escape(data.home.section)}</h2><div class="cards">${productCard(code, data.home.pvc, data.home.pvcText, 'pvc', '/assets/catalogs/covers/dream-house-wall-panel.jpg', data.common.explore)}${productCard(code, data.home.wpc, data.home.wpcText, 'wpc', '/assets/catalogs/covers/wpc-collection-2026.jpg', data.common.explore)}</div></section><section class="band"><div class="wrap"><h2>${escape(data.home.process)}</h2><ol class="steps">${data.home.steps.map((step) => `<li>${escape(step)}</li>`).join('')}</ol></div></section><section class="wrap section"><h2>${escape(data.home.catalogs)}</h2><div class="catalogs"><a href="/assets/catalogs/dream-house-wall-panel-catalog.pdf">PVC · PDF ↗</a><a href="/assets/catalogs/wpc-collection-2026.pdf">WPC · PDF ↗</a><a href="/assets/catalogs/3d-pvc-panel-catalog.pdf">3D PVC · PDF ↗</a></div><p class="fine">${escape(data.home.catalogNote)}</p></section><section class="wrap section cta"><h2>${escape(data.home.contact)}</h2><p>${escape(data.home.contactText)}</p><a class="button" href="/${code}/contact.html">${escape(data.common.quote)}</a></section>`;
const productBody = (code, data, kind) => {
  const info = data[kind];
  const pdf = kind === 'pvc' ? '/assets/catalogs/dream-house-wall-panel-catalog.pdf' : '/assets/catalogs/wpc-collection-2026.pdf';
  const image = kind === 'pvc' ? '/assets/catalogs/covers/dream-house-wall-panel.jpg' : '/assets/catalogs/covers/wpc-collection-2026.jpg';
  return `<section class="hero"><div class="wrap hero-grid"><div><span class="eyebrow">Luvie Industry · ${kind.toUpperCase()}</span><h1>${escape(info.h1)}</h1><p class="lead">${escape(info.intro)}</p><div class="actions"><a class="button" href="${pdf}">${escape(info.catalog)}</a><a class="button outline" href="/${code}/contact.html">${escape(data.common.quote)}</a></div></div><img class="hero-image" src="${image}" alt="${escape(info.imageAlt)}" width="900" height="600"></div></section><div class="wrap section detail">${info.questions.map((question, index) => `<section><h2>${escape(question)}</h2><p>${escape(info.answers[index])}</p></section>`).join('')}<aside class="callout"><p>${escape(data.common.disclaimer)}</p><a class="button" href="/${code}/contact.html">${escape(data.common.contact)}</a></aside></div>`;
};
const contactBody = (code, data) => `<section class="hero"><div class="wrap narrow"><span class="eyebrow">Luvie Industry</span><h1>${escape(data.contact.h1)}</h1><p class="lead">${escape(data.contact.intro)}</p></div></section><section class="wrap section narrow"><h2>${escape(data.contact.needed)}</h2><ul class="checklist">${data.contact.items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul><div class="actions"><a class="button" href="${emailLink('Luvie product inquiry')}">${escape(data.contact.email)}</a><a class="button outline" href="https://wa.me/306947135317">${escape(data.contact.whatsapp)}</a></div><p class="fine">${escape(data.contact.note)}</p><p><a href="/assets/catalogs/dream-house-wall-panel-catalog.pdf">PVC · PDF</a> · <a href="/assets/catalogs/wpc-collection-2026.pdf">WPC · PDF</a></p></section>`;

const firstGuides = {
  es: ['/es/articles/panel-ranurado-pvc-pared.html', 'Guía de compra en español', 'Cómo elegir paneles ranurados de PVC'],
  'pt-br': ['/pt-br/articles/painel-ripado-pvc-parede.html', 'Guia de compra em português', 'Como escolher painel ripado de PVC'],
  ar: ['/ar/articles/fluted-pvc-wall-panels.html', 'دليل الشراء بالعربية', 'كيف تختار ألواح PVC المخددة؟'],
};
const guidePromo = (code) => {
  const [route, heading, title] = firstGuides[code];
  return `<section class="wrap section"><h2>${heading}</h2><p><a class="button outline" href="${route}">${title}</a></p></section>`;
};

for (const [code, data] of Object.entries(locales)) {
  for (const page of ['home', 'pvc', 'wpc', 'contact']) {
    const image = page === 'wpc' ? '/assets/catalogs/covers/wpc-collection-2026.jpg' : page === 'pvc' ? '/assets/catalogs/covers/dream-house-wall-panel.jpg' : '/assets/quote-product-images/image3.jpeg';
    const body = page === 'home' ? homeBody(code, data).replaceAll('image6.jpeg', 'image3.jpeg') + guidePromo(code) : page === 'contact' ? contactBody(code, data) : productBody(code, data, page);
    const relative = pagePath(code, page).slice(1);
    const file = path.join(root, relative.endsWith('/') ? `${relative}index.html` : relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, shell(code, data, page, body, image).replace('</head>', `${pixel}</head>`));
  }
}
console.log(`Built ${Object.keys(locales).length * 4} localized core pages (${today}).`);
