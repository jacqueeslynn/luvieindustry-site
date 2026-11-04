import fs from 'node:fs';
const file='content/daily-guides-20261104-translations.json';
const cache=JSON.parse(fs.readFileSync(file));
// Reviewed multiword terminology corrections, never short substring substitutions.
const changes=[
['| luvie','| Luvie'],['| لوفي','| Luvie'],
['un panel, cartón u otra unidad','un panel, una caja u otra unidad'],['nombre final','nombre del acabado'],['nome final','nome do acabamento'],['texto do aplicativo','texto sobre a aplicação'],['omita la reclamación','omita la afirmación'],['omita a reclamação','omita a alegação'],['adornos que sólo','perfiles de remate que sólo'],['los adornos, adhesivos','los perfiles de remate, adhesivos'],
['Dimensiones de los paneles separados, cobertura instalada utilizable y cantidades de cajas; Confirma lo que incluye el precio.','Registre por separado las dimensiones del panel, la cobertura útil instalada y las cantidades por caja; confirme qué incluye el precio.'],
['Dimensões separadas do painel, cobertura instalada utilizável e quantidades de caixas;','Registre separadamente as dimensões dos painéis, a cobertura útil instalada e as quantidades por caixa;'],['explicações portuguesas','explicações em português'],['ficha técnica portuguesa','ficha técnica em português'],['Propietario de registro designado','Responsable del registro designado'],['Proprietário do registro nomeado','Responsável pelo registro designado'],
['una cabina sea reutilizable','un stand sea reutilizable'],['sistema de visualización de soporte','estructura de soporte del expositor'],['la pantalla como reutilizable','el expositor como reutilizable'],['para la asamblea real','para el montaje real'],['módulos de respaldo manejables','módulos de soporte fáciles de manipular'],['la eliminación prevista','el desmontaje previsto'],
['sistema de exibição de suporte','estrutura de suporte do expositor'],['empresa contratante do estande','empresa montadora do estande'],['o monitor como reutilizável','o expositor como reutilizável'],['contratante responsável','montadora responsável'],['o contratante pode','a montadora pode'],['ao contratante para','à montadora para'],['pelo contratante e','pela montadora e'],['módulos de apoio gerenciáveis','módulos de suporte fáceis de manusear'],
['el orden combinado','el pedido completo'],['cronograma de pedidos actual','listado de pedido actualizado'],['un solo cronograma','un solo listado'],['con el cronograma','con el listado'],['cada cronograma revisado','cada listado revisado'],['última programación aceptada','última versión aceptada del listado'],['claro estatus de superación','estado claramente marcado como sustituido'],['la instrucción en vivo','la instrucción vigente'],['Una historia es útil','Un historial es útil'],['cronograma actual de pedidos','listado actual de pedidos'],['cronograma de acabado y cantidad','listado de acabados y cantidades'],
['a ordem combinada','o pedido completo'],['programação de pedido atual','lista atualizada do pedido'],['um único cronograma','uma única lista'],['com o cronograma','com a lista'],['cada cronograma revisado','cada lista revisada'],['último cronograma aceito','última lista aceita'],['parte não cumprida da ordem original','parte não atendida do pedido original'],['Uma história só é útil','Um histórico só é útil'],['a instrução ao vivo','a instrução vigente'],['programação atual de pedidos WPC','lista atualizada do pedido de WPC'],['acabamento e programação de quantidade','acabamento e lista de quantidades'],
['ملف التعريف المحدد','مقطع اللوح المحدد'],['ملف تعريف الانضمام','مقطع التعشيق'],['الاسم النهائي','اسم التشطيب'],['النهاية الفعلية المحددة','التشطيب الفعلي المختار'],['تسمية النهاية محليًا','تسمية التشطيب محليًا'],['لجنة معينة تلبي','لوح معين يلبي'],['اسم النهاية المترجم','اسم التشطيب المترجم'],['جدول الإنهاء والكمية','جدول التشطيبات والكميات'],['التعليم المباشر','التعليمات السارية'],['مع ترتيب الأسئلة اللاحقة','مع الطلب للرجوع إليه عند ظهور أسئلة لاحقة'],
['وصف الشاشة بأنها','وصف وحدة العرض بأنها'],['الأسطح المستعبدة بشكل دائم','الأسطح الملصقة بشكل دائم'],['ثبات الموقف','ثبات جناح العرض'],['تنشر الصحة والسلامة والبيئة','تنشر هيئة الصحة والسلامة البريطانية HSE'],['نظام المرفقات','نظام التثبيت'],['التجميع مع المكان ومزود','الاستلام مع إدارة الموقع ومزود'],['المفاصل أو الظهر','الوصلات أو اللوح الداعم'],['تصميم الحامل قبل اختيار النهاية','تصميم الجناح قبل اختيار التشطيب'],['المعلومات النهائية المقترحة والمنتج الحالي','التشطيب المقترح ومعلومات المنتج الحالية'],['اللمسة النهائية المربوطة','طبقة التشطيب الملصقة'],['أبعاد اللوحة المنفصلة والتغطية المثبتة القابلة للاستخدام وكميات الكرتون؛ تأكيد ما يشمله السعر.','سجّل أبعاد اللوح والتغطية الفعلية بعد التركيب والكميات في كل صندوق بشكل منفصل، وأكّد ما يشمله السعر.'],['أو أن التغييرات قيد التنفيذ بالفعل','أو يعدّل الأعمال التي بدأ تنفيذها بالفعل']
];
function walk(v){if(typeof v==='string'){for(const[a,b]of changes)v=v.split(a).join(b);return v;}if(Array.isArray(v))return v.map(walk);return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x)]));}
for(const k of Object.keys(cache))cache[k]=walk(cache[k]);
const b='brazil-pvc-wall-panels-online-listing-data.html:';
cache[b+'es'].title='Paneles PVC en Brasil: ficha para venta online | Luvie';
cache[b+'pt-br'].title='Painéis PVC no Brasil: cadastro para venda online | Luvie';
cache[b+'ar'].title='ألواح PVC في البرازيل: بيانات البيع الإلكتروني | Luvie';
cache[b+'pt-br'].description='Prepare um anúncio em português para painéis de PVC no Brasil: unidade de venda, cobertura útil, documentação do modelo e imagens corretas.';
cache[b+'ar'].description='أعد صفحة بيع باللغة البرتغالية لألواح PVC في البرازيل، مع تحديد وحدة البيع والتغطية الفعلية ووثائق الموديل والصور الصحيحة.';
cache[b+'ar'].sections[0][1]=cache[b+'ar'].sections[0][1].replace('لا يتم تلقائيًا تغطية المستطيل الاسمي بتغطيته القابلة للاستخدام بعد الانضمام أو القطع.','المساحة المحسوبة من الأبعاد الاسمية لا تساوي بالضرورة التغطية الفعلية بعد التعشيق أو القص.');
const u='uae-pu-stone-panels-exhibition-display-reuse.html:';
cache[u+'es'].title='Paneles PU en EAU: reutilización de expositores | Luvie';
cache[u+'pt-br'].title='Painéis PU nos EAU: reutilização de expositores | Luvie';
cache[u+'ar'].title='ألواح PU في الإمارات: إعادة استخدام وحدات العرض | Luvie';
cache[u+'ar'].description='خطط لوحدة عرض بكسوة PU بمظهر الحجر في الإمارات: متطلبات الموقع، تجربة التجميع والفك، التغليف وتوقعات واقعية لإعادة الاستخدام.';
cache[u+'ar'].answer='تعامل مع لوح الزينة وهيكل العرض الداعم كعنصرين منفصلين. اطلب من مقاول الجناح تصميم التجميع الكامل واعتماده وفق متطلبات الموقع، بما يشمل التفكيك. اختبر طريقة الفك والتغليف قبل وصف وحدة العرض بأنها قابلة لإعادة الاستخدام. لا تفترض إمكان نزع التشطيب الملصق بشكل دائم دون تلف.';
const z='uzbekistan-wpc-wall-panels-order-revision-control.html:';
cache[z+'es'].title='Paneles WPC para Uzbekistán: cambios del pedido | Luvie';
cache[z+'es'].heading='Paneles WPC para Uzbekistán: controle los cambios del pedido antes del envío';
cache[z+'pt-br'].title='Painéis WPC para o Uzbequistão: revisar pedidos | Luvie';
cache[z+'ar'].title='ألواح WPC لأوزبكستان: إدارة تعديلات الطلب | Luvie';
fs.writeFileSync(file,JSON.stringify(cache,null,2)+'\n');
