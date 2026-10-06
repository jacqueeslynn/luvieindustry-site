import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const date = '2026-10-06';
const base = 'https://luvieindustry.com';
const locales = {
  en: { prefix: '', html: 'en', dir: 'ltr', home: 'Home', resources: 'Resources', evidence: 'Independent reference', note: 'This source explains the general decision. It does not certify a Luvie product.', more: 'Continue your research', catalog: 'View the relevant product catalog (PDF)', product: 'Explore the product family', contact: 'Discuss a sample and specification', imageNote: 'Illustrative product or market context; verify the exact SKU and installation.' },
  es: { prefix: '/es', html: 'es', dir: 'ltr', home: 'Inicio', resources: 'Guías', evidence: 'Referencia independiente', note: 'Esta fuente orienta la decisión general; no certifica un producto de Luvie.', more: 'Siga investigando', catalog: 'Ver el catálogo del producto (PDF)', product: 'Explorar la familia de productos', contact: 'Consultar muestras y especificaciones', imageNote: 'Imagen ilustrativa; verifique el modelo y la instalación específicos.' },
  'pt-br': { prefix: '/pt-br', html: 'pt-BR', dir: 'ltr', home: 'Início', resources: 'Guias', evidence: 'Referência independente', note: 'Esta fonte orienta a decisão geral; não certifica um produto da Luvie.', more: 'Continue a pesquisa', catalog: 'Ver o catálogo do produto (PDF)', product: 'Explorar a linha de produtos', contact: 'Consultar amostra e especificações', imageNote: 'Imagem ilustrativa; confirme o modelo e a instalação específicos.' },
  ar: { prefix: '/ar', html: 'ar', dir: 'rtl', home: 'الرئيسية', resources: 'الأدلة', evidence: 'مرجع مستقل', note: 'يوضح هذا المصدر القرار العام ولا يُعد شهادة لمنتج من Luvie.', more: 'تابع البحث', catalog: 'افتح كتالوج المنتج PDF', product: 'استكشف فئة المنتج', contact: 'استفسر عن العينة والمواصفات', imageNote: 'صورة توضيحية؛ تحقق من الطراز وطريقة التركيب المحددين.' },
};
const guides = [
  {
    file: 'brazil-pvc-ceiling-panel-import-documents.html', image: 'pvc-ceiling-brazil-installation.webp',
    catalog: '/assets/catalogs/dream-house-wall-panel-catalog.pdf', product: '/products/pvc-wall-panels.html',
    source: 'https://www.gov.br/siscomex/pt-br/informacoes/tratamento-administrativos/tratamento-administrativo-na-importacao',
    related: ['gulf-hotel-decorative-wall-condensation.html', 'uzbekistan-wall-panels-winter-delivery.html', 'import-wall-panels-china-document-checklist.html', 'pvc-ceiling-installation-brazil-support-spacing.html'],
    en: {
      title: 'Importing PVC Ceiling Panels to Brazil: Document Checks | Luvie',
      description: 'Before importing PVC ceiling panels to Brazil, align the exact profile, NCM classification, administrative treatment, shipment documents and sample approval.',
      heading: 'Importing PVC ceiling panels to Brazil: what should buyers verify first?',
      lead: 'A ceiling-panel order can be commercially agreed yet still stall at customs or on site. The useful starting point is not a generic list of “required documents”: it is the exact panel description, intended use, tariff classification and current administrative treatment for the specific operation.',
      answer: 'Confirm the SKU and technical description, have a Brazilian customs specialist classify it, check the live Siscomex treatment simulator, and reconcile every commercial and packing document before shipment.',
      sections: [
        ['Start with the exact panel, not the category name', 'PVC ceiling panel is a sales description, not a complete customs or project specification. Record the resin or composite construction, profile cross-section, total and effective width, length, thickness, finish, accessories and intended use. Photograph the approved physical sample and keep its code with the quotation. Different constructions may call for different tariff analysis or evidence; do not copy an NCM code from a visually similar item without review.'],
        ['Check Brazilian import treatment at the time of the order', 'Brazilian Siscomex says its information tables are indicative and the Import Administrative Treatment Simulator should be used to verify what applies to a specific import operation. The importer or broker should confirm the current NCM classification, any licensing or agency consent, and the route that applies when the declaration is filed. Do not promise that every PVC ceiling panel is exempt from licensing or that one historical clearance settles the next shipment.'],
        ['Make the documents describe the same goods', 'Compare the pro forma invoice, commercial invoice, packing list, bill of lading and product data against the approved sample. Check carton count, panel lengths, gross and net weights, accessory lines, country of origin, buyer details and Incoterm. A mismatch between a decorative catalog name and the customs description can delay clarification. Ask the freight partner how long panels and trims will be protected, stacked and identified in the container.'],
        ['Separate customs approval from installation approval', 'Clearing an import does not establish that the ceiling system suits a particular room or local building requirement. Before the buyer markets a model, request its current installation instructions, support-spacing guidance, joint and expansion details, cleaning instructions and any test evidence relevant to the exact SKU. On a humid or air-conditioned project, the substrate, ventilation and water pathways remain design questions. A catalog image is a shortlist tool, not a compliance certificate.'],
        ['A practical first-order handoff', 'An importer planning a trial shipment can send Luvie the destination state, room type, target profile, finish reference, estimated area and accessory list. The broker then checks classification and administrative treatment using the precise product description. After the sample and document names match, confirm quantities, packing and commercial terms in writing. This sequence reduces avoidable rework without claiming a guaranteed customs outcome.'],
      ],
      closing: 'Ask for a current model-specific data sheet and sample, then let your Brazilian customs and project specialists confirm the applicable requirements.',
    },
    es: {
      title: 'Importar paneles de techo de PVC a Brasil: documentos | Luvie',
      description: 'Antes de importar paneles de techo de PVC a Brasil, verifique el perfil, la clasificación NCM, el tratamiento administrativo y los documentos del envío.',
      heading: 'Importar paneles de techo de PVC a Brasil: ¿qué comprobar primero?',
      lead: 'Un pedido puede estar cerrado comercialmente y aun así detenerse en aduana o en la obra. El punto de partida es la descripción exacta del panel, su uso previsto, la clasificación arancelaria y el tratamiento vigente de la operación.',
      answer: 'Confirme el modelo y la ficha técnica, encargue la clasificación a un especialista brasileño, consulte el simulador actual de Siscomex y concilie los documentos antes del embarque.',
      sections: [
        ['Defina el panel exacto', '«Panel de techo de PVC» es una descripción comercial, no una especificación completa. Registre composición, sección del perfil, ancho total y útil, largo, espesor, acabado, accesorios y uso previsto. Conserve la fotografía y el código de la muestra aprobada con la oferta. No copie un código NCM de un producto parecido sin revisión profesional.'],
        ['Revise el tratamiento de importación vigente', 'Siscomex indica que sus tablas son informativas y que el simulador de tratamiento administrativo determina lo aplicable a cada operación. El importador o su agente debe confirmar NCM, licencias, anuencias y proceso al presentar la declaración. Un despacho anterior no garantiza el mismo resultado para otro modelo o fecha.'],
        ['Haga coincidir mercancía y documentos', 'Compare factura proforma, factura comercial, lista de empaque, conocimiento de embarque y ficha del producto con la muestra. Revise bultos, largos, pesos, perfiles complementarios, origen, datos del comprador e Incoterm. Una diferencia entre el nombre del catálogo y la descripción aduanera puede exigir aclaraciones.'],
        ['No confunda aduana con aprobación de obra', 'La liberación de importación no demuestra que el sistema sea apto para cualquier techo. Solicite instrucciones actuales de montaje, separación de soportes, juntas, dilatación, limpieza y pruebas pertinentes al modelo. En espacios húmedos o climatizados también importan base, ventilación y control del agua.'],
        ['Traspaso para el primer pedido', 'Envíe a Luvie el destino, tipo de sala, perfil elegido, acabado, área estimada y accesorios. El agente aduanero revisa la clasificación con esa descripción. Después se confirman muestra, cantidades, empaque y términos por escrito; nadie debe prometer un resultado aduanero garantizado.'],
      ],
      closing: 'Solicite muestra y ficha del modelo actual; los especialistas brasileños deben confirmar requisitos de importación y proyecto.',
    },
    'pt-br': {
      title: 'Importar forro de PVC para o Brasil: documentos | Luvie',
      description: 'Antes de importar forro de PVC para o Brasil, confira perfil, classificação NCM, tratamento administrativo, documentos do embarque e amostra aprovada.',
      heading: 'Importação de forro de PVC: o que o comprador brasileiro deve verificar?',
      lead: 'Uma compra pode estar acertada comercialmente e ainda enfrentar problemas na alfândega ou na obra. Comece pela descrição exata do painel, uso previsto, classificação fiscal e tratamento administrativo atual da operação.',
      answer: 'Confirme o SKU e a ficha técnica, peça a classificação a um especialista brasileiro, consulte o simulador do Siscomex e concilie os documentos antes do embarque.',
      sections: [
        ['Descreva o painel exato', '“Forro de PVC” é um nome comercial, não uma especificação completa. Registre composição, seção do perfil, largura total e útil, comprimento, espessura, acabamento, acessórios e uso previsto. Guarde a foto e o código da amostra aprovada junto à proposta. Não reutilize um NCM de produto visualmente parecido sem análise profissional.'],
        ['Consulte o tratamento administrativo vigente', 'O Siscomex informa que suas tabelas são indicativas; o simulador de tratamento administrativo deve ser usado para verificar a operação concreta. Importador ou despachante precisa confirmar NCM, licenças, anuências e procedimento na data do registro. Um desembaraço antigo não resolve automaticamente o próximo pedido.'],
        ['Faça os documentos descreverem a mesma mercadoria', 'Compare fatura proforma, fatura comercial, packing list, conhecimento de embarque e ficha técnica com a amostra. Confira volumes, comprimentos, pesos, acessórios, origem, comprador e Incoterm. Divergências entre o nome de catálogo e a descrição aduaneira podem gerar exigências. Planeje proteção e identificação de painéis longos e arremates.'],
        ['Separe desembaraço de aprovação da instalação', 'Liberar a importação não prova adequação a qualquer teto. Peça instruções atuais de montagem, espaçamento dos suportes, juntas, dilatação, limpeza e evidências pertinentes ao SKU. Em ambientes úmidos ou climatizados, base, ventilação e caminhos da água continuam sendo decisões de projeto.'],
        ['Fluxo para o primeiro lote', 'Informe à Luvie o estado de destino, ambiente, perfil, acabamento, área estimada e acessórios. O despachante verifica a classificação com essa descrição. Depois confirme amostra, quantidade, embalagem e condições comerciais por escrito, sem prometer liberação automática.'],
      ],
      closing: 'Solicite amostra e ficha atuais; profissionais brasileiros devem confirmar as exigências fiscais, aduaneiras e de instalação.',
    },
    ar: {
      title: 'استيراد ألواح سقف PVC إلى البرازيل: فحص المستندات | Luvie',
      description: 'راجع طراز ألواح سقف PVC وتصنيف NCM ومتطلبات الاستيراد البرازيلية وتطابق مستندات الشحن والعينة المعتمدة قبل إرسال الطلب.',
      heading: 'استيراد ألواح سقف PVC إلى البرازيل: ما الذي يجب التحقق منه؟',
      lead: 'قد يكون الطلب متفقاً عليه تجارياً ثم يتعطل في الجمارك أو في موقع المشروع. ابدأ بوصف اللوح المحدد واستخدامه وتصنيفه الجمركي والمتطلبات الإدارية السارية على العملية.',
      answer: 'حدّد رمز المنتج ومواصفاته، واطلب من مختص برازيلي مراجعة التصنيف، وافحص محاكي Siscomex الحالي، وطابق المستندات قبل الشحن.',
      sections: [
        ['ابدأ بالطراز المحدد', 'اسم ألواح سقف PVC اسم تجاري لا يمثل مواصفة كاملة. سجّل التركيب وشكل المقطع والعرض الكلي والفعلي والطول والسماكة والتشطيب والملحقات والاستخدام المقصود. احتفظ بصورة العينة المعتمدة ورمزها مع عرض السعر. لا تنقل رمز NCM من سلعة مشابهة من دون مراجعة مختص.'],
        ['افحص متطلبات الاستيراد الحالية', 'يوضح Siscomex أن الجداول معلومات إرشادية وأن محاكي المعاملة الإدارية يحدد ما ينطبق على العملية المحددة. يجب أن يراجع المستورد أو المخلص التصنيف والتراخيص وموافقات الجهات والإجراء وقت تقديم البيان. تخليص شحنة سابقة لا يضمن نتيجة الشحنة التالية.'],
        ['طابق البضاعة مع كل مستند', 'قارن الفاتورة الأولية والتجارية وقائمة التعبئة وبوليصة الشحن والبيانات الفنية بالعينة. راجع عدد الطرود والأطوال والأوزان والملحقات والمنشأ وبيانات المشتري وشرط التجارة. اختلاف الاسم التسويقي عن الوصف الجمركي قد يتطلب توضيحاً.'],
        ['افصل الجمارك عن موافقة المشروع', 'السماح بالاستيراد لا يثبت صلاحية النظام لكل سقف. اطلب تعليمات التركيب الحالية والمسافات بين الدعامات والفواصل والتمدد والتنظيف وأدلة الاختبار الخاصة بالطراز. وفي الأماكن الرطبة أو المكيفة يجب تقييم القاعدة والتهوية ومسارات الماء.'],
        ['خطوات أول طلب', 'أرسل إلى Luvie وجهة الشحنة ونوع المكان والطراز والتشطيب والمساحة والملحقات. يراجع المختص الجمركي التصنيف وفق الوصف الدقيق، ثم تعتمد العينة والكميات والتعبئة والشروط كتابةً من دون وعد بنتيجة جمركية مضمونة.'],
      ],
      closing: 'اطلب عينة وبيانات الطراز الحالي ودع المختصين في البرازيل يؤكدون متطلبات الاستيراد والتركيب.',
    },
  },
  {
    file: 'gulf-hotel-decorative-wall-condensation.html', image: 'gulf-hospitality-panel-evidence.webp',
    catalog: '/assets/catalogs/wpc-collection-2026.pdf', product: '/products/wpc-wall-panels.html',
    source: 'https://www.epa.gov/iaq-schools/moisture-control-part-indoor-air-quality-design-tools-schools',
    related: ['brazil-pvc-ceiling-panel-import-documents.html', 'uzbekistan-wall-panels-winter-delivery.html', 'gulf-hotel-wall-panel-fire-evidence-checklist.html', 'pvc-wall-panels-coastal-humid-interiors.html'],
    en: {
      title: 'Gulf Hotel Decorative Walls: Condensation Checks | Luvie',
      description: 'For air-conditioned Gulf hotels, review condensation behind decorative PVC or WPC wall panels before approving a finish, substrate, fixing method or sample.',
      heading: 'Can decorative wall panels hide condensation in a Gulf hotel?',
      lead: 'A hotel lobby can look dry while warm humid outdoor air moves toward chilled surfaces inside its wall. The buyer’s question is not merely whether the decorative panel can be wiped clean; it is whether the complete wall assembly controls air and moisture at that location.',
      answer: 'Yes, concealed moisture is possible when humid air reaches a cooled wall cavity or substrate. Assess the building envelope and HVAC design before selecting or fixing the decorative finish.',
      sections: [
        ['Map the exposure before selecting a finish', 'Record whether the wall is an exterior perimeter wall, a cooled internal partition, a bathroom-adjacent wall or a reception feature. Note AC operation, doors that open frequently, known leaks and any staining or odor. The same panel can face different risks in a conditioned lobby and a sheltered corridor. Neither PVC nor WPC is a universal solution to moisture behind a finish.'],
        ['Ask where humid air can meet a cold surface', 'The U.S. EPA explains that in hot, humid climates even slight negative pressure can pull outdoor moisture into chilled wall cavities. This is general building-science guidance, not a test of Luvie panels. Ask the architect or mechanical engineer to review the air barrier, pressure balance, insulation and condensation risk. A solid decorative face should never be used to cover an unexplained damp patch.'],
        ['Approve the wall assembly, not only the panel face', 'Request the exact SKU and its approved interior use, then review substrate dryness, fixing, joints, corners, penetrations and access for maintenance. Check whether the proposed adhesive or mechanical fixing is compatible with the substrate and the room’s cleaning regime. If the wall requires drying to the interior, adding a low-permeability finish without a design review may change its behavior. The designer must determine the appropriate assembly.'],
        ['Build a sample panel under realistic conditions', 'A physical mock-up should include a corner, a joint and at least one service penetration, not just a flat center piece. Observe it under the intended lighting and air-conditioning cycle. Specify who inspects the backing before enclosure and how any leak will be investigated later. Confirm fire and emissions evidence separately for the exact panel and installation if the hotel authority requires it.'],
        ['Illustrative hotel decision', 'Imagine a feature wall beside a revolving entrance in a humid coastal city. The proposed fluted surface looks suitable, but staff report occasional odor near the wall after busy evenings. The correct next step is to investigate air leakage, HVAC pressure and substrate condition, not to sell a more water-resistant-looking face. Once the wall is sound, compare samples and finish details for the design brief.'],
      ],
      closing: 'Send the room type, wall position, climate-control conditions and selected sample to discuss a product-specific specification route.',
    },
    es: {
      title: 'Paredes decorativas en hoteles del Golfo: condensación | Luvie',
      description: 'En hoteles climatizados del Golfo, revise la condensación detrás de paneles decorativos de PVC o WPC antes de aprobar el acabado y su montaje.',
      heading: '¿Pueden los paneles decorativos ocultar condensación en un hotel del Golfo?',
      lead: 'Un vestíbulo puede verse seco mientras el aire exterior cálido y húmedo entra en una cavidad de pared fría. La cuestión no es solo si el panel se limpia fácilmente, sino si todo el muro controla aire y humedad.',
      answer: 'Sí, puede haber humedad oculta cuando el aire húmedo llega a una superficie enfriada. Revise envolvente y climatización antes de escoger el acabado.',
      sections: [
        ['Ubique la exposición', 'Distinga pared exterior, tabique interior refrigerado, zona cercana al baño y pared de recepción. Registre uso del aire acondicionado, puertas frecuentes, fugas, manchas y olores. Un mismo panel puede tener riesgos distintos según la habitación. Ni PVC ni WPC resuelven por sí solos la humedad detrás del acabado.'],
        ['Identifique el encuentro entre aire húmedo y superficie fría', 'La EPA estadounidense explica que en climas cálidos y húmedos una pequeña presión negativa puede llevar humedad exterior a cavidades frías. Es una referencia de construcción, no una prueba de Luvie. Pida al arquitecto o ingeniero revisar barrera de aire, presión, aislamiento y riesgo de condensación. No tape una mancha húmeda con un panel.'],
        ['Apruebe el sistema completo', 'Solicite el SKU exacto y su uso interior previsto. Revise sequedad del soporte, fijación, juntas, esquinas, penetraciones y acceso para mantenimiento. Compruebe compatibilidad del adhesivo o fijación con la base y la limpieza. Un acabado de baja permeabilidad puede cambiar el secado de la pared; corresponde al diseñador decidir el sistema.'],
        ['Ensaye una muestra representativa', 'El montaje de prueba debe incluir esquina, junta y paso de instalaciones, no solo una pieza plana. Obsérvelo con la iluminación y la climatización previstas. Asigne la inspección de la base y el método para investigar futuras fugas. Las pruebas de fuego y emisiones, si se exigen, deben corresponder al producto y montaje exactos.'],
        ['Caso ilustrativo', 'Junto a una entrada de hotel en una ciudad costera aparece olor ocasional. Antes de vender un acabado de apariencia resistente al agua, se investigan infiltración de aire, presión HVAC y estado del soporte. Solo cuando la pared está sana se comparan muestras y remates.'],
      ],
      closing: 'Comparta tipo de sala, posición de la pared, climatización y muestra elegida para estudiar una especificación concreta.',
    },
    'pt-br': {
      title: 'Parede decorativa em hotel do Golfo: condensação | Luvie',
      description: 'Em hotéis climatizados do Golfo, avalie condensação atrás de painéis decorativos de PVC ou WPC antes de aprovar acabamento e fixação.',
      heading: 'Um painel decorativo pode esconder condensação em hotel do Golfo?',
      lead: 'O lobby pode parecer seco enquanto ar externo quente e úmido alcança uma cavidade fria. A pergunta não é só se a face pode ser limpa, mas se a parede completa controla ar e umidade.',
      answer: 'Sim, pode haver umidade oculta quando ar úmido encontra superfície resfriada. Avalie envoltória e ar-condicionado antes do acabamento.',
      sections: [
        ['Mapeie a exposição', 'Diferencie parede externa, divisória interna resfriada, parede próxima ao banheiro e destaque da recepção. Anote operação do ar-condicionado, portas movimentadas, vazamentos, manchas e odores. Um mesmo painel enfrenta riscos distintos em ambientes diferentes. PVC ou WPC não resolve sozinho umidade atrás do acabamento.'],
        ['Localize o encontro do ar úmido com a parede fria', 'A EPA dos EUA explica que, em clima quente e úmido, pequena pressão negativa pode puxar umidade externa para cavidades frias. É orientação geral, não ensaio de produto Luvie. Peça ao projetista avaliação da barreira de ar, pressão, isolamento e condensação. Não cubra um ponto úmido sem investigar.'],
        ['Aprove o conjunto da parede', 'Solicite o SKU e uso interno previsto. Confira secura da base, fixação, juntas, cantos, passagens e manutenção. Verifique compatibilidade de cola ou fixadores com a base e limpeza do ambiente. Acabamento de baixa permeabilidade pode alterar a secagem da parede; o projetista define o conjunto correto.'],
        ['Faça uma amostra realista', 'O mock-up deve incluir canto, junta e passagem de serviço, além da superfície plana. Observe sob iluminação e ciclo de climatização planejados. Defina quem examina a base e como investigar eventual vazamento. Exigências de fogo e emissões devem corresponder ao painel e montagem exatos.'],
        ['Exemplo de decisão', 'Perto da entrada de um hotel costeiro surge odor eventual. Antes de oferecer uma face com aparência impermeável, a equipe investiga entrada de ar, pressão do HVAC e condição do substrato. Somente depois compara amostras e arremates.'],
      ],
      closing: 'Informe ambiente, posição da parede, climatização e amostra para discutir uma especificação do produto.',
    },
    ar: {
      title: 'جدران الفنادق الزخرفية في الخليج: فحص التكاثف | Luvie',
      description: 'في فنادق الخليج المكيفة، افحص احتمال التكاثف خلف ألواح PVC أو WPC الزخرفية قبل اعتماد التشطيب والقاعدة وطريقة التثبيت.',
      heading: 'هل قد تخفي ألواح الجدران الزخرفية تكاثفاً في فندق خليجي؟',
      lead: 'قد يبدو بهو الفندق جافاً بينما يتحرك الهواء الخارجي الحار والرطب نحو سطح بارد داخل الجدار. السؤال ليس سهولة تنظيف اللوح فقط، بل قدرة نظام الجدار كله على ضبط الهواء والرطوبة.',
      answer: 'نعم، قد توجد رطوبة مخفية عندما يصل الهواء الرطب إلى تجويف أو سطح مبرد. راجع الغلاف الخارجي والتكييف قبل اختيار التشطيب.',
      sections: [
        ['حدّد موضع الجدار والتعرض', 'ميّز بين الجدار الخارجي والقاطع الداخلي المبرد والجدار قرب الحمام وحائط الاستقبال. سجّل تشغيل التكييف وفتح الأبواب والتسربات والبقع والروائح. تختلف المخاطر بين بهو مكيف وممر محمي. لا يحل PVC أو WPC مشكلة الرطوبة خلف التشطيب وحده.'],
        ['ابحث عن موضع التقاء الرطوبة والبرودة', 'توضح وكالة حماية البيئة الأمريكية أن ضغطاً داخلياً سالباً طفيفاً في المناخ الحار الرطب قد يسحب الرطوبة الخارجية إلى تجاويف الجدران الباردة. هذا توجيه عام لا اختبار لمنتجات Luvie. اطلب مراجعة حاجز الهواء والضغط والعزل وخطر التكاثف. لا تغط بقعة رطبة بلوح جديد.'],
        ['اعتمد نظام الجدار كله', 'اطلب رمز المنتج واستخدامه الداخلي المحدد، ثم افحص جفاف القاعدة والتثبيت والفواصل والزوايا والاختراقات وإمكانية الصيانة. تحقق من توافق اللاصق أو المثبت مع القاعدة والتنظيف. قد يغير التشطيب ضعيف نفاذية البخار سلوك الجفاف، وعلى المصمم تحديد النظام المناسب.'],
        ['أنشئ نموذجاً واقعياً', 'ينبغي أن يشمل النموذج زاوية وفاصلاً وفتحة خدمة لا مساحة مسطحة فقط. راقبه تحت الإضاءة ودورة التكييف المقصودتين. حدّد من يفحص القاعدة وكيف سيُكشف أي تسرب لاحق. إن لزمت أدلة الحريق أو الانبعاثات فيجب أن تطابق اللوح والتركيب المحددين.'],
        ['مثال توضيحي', 'تظهر رائحة متقطعة بجوار مدخل فندق ساحلي. لا يكون الحل بيع سطح يبدو أكثر مقاومة للماء؛ بل فحص تسرب الهواء وضغط التكييف وحالة القاعدة أولاً. بعد سلامة الجدار تُقارن العينات والتفاصيل الجمالية.'],
      ],
      closing: 'أرسل نوع الغرفة وموضع الجدار وظروف التكييف والعينة المختارة لمناقشة مواصفة محددة.',
    },
  },
  {
    file: 'uzbekistan-wall-panels-winter-delivery.html', image: 'uzbekistan-panel-shipment-check.webp',
    catalog: '/assets/catalogs/dream-house-wall-panel-catalog.pdf', product: '/products/pvc-wall-panels.html',
    source: 'https://unece.org/transport/documents/standards/ctu-code',
    related: ['brazil-pvc-ceiling-panel-import-documents.html', 'gulf-hotel-decorative-wall-condensation.html', 'prevent-container-condensation-wall-panels.html', 'import-pvc-wall-panels-uzbekistan-2026-checklist.html'],
    en: {
      title: 'Wall Panels to Uzbekistan in Winter: Arrival Checks | Luvie',
      description: 'A winter-arrival checklist for Uzbekistan wall panel importers: inspect packaging, moisture, temperature transition, samples and substrate before installation.',
      heading: 'Wall panels delivered to Uzbekistan in winter: what happens before installation?',
      lead: 'A container or truck can arrive with sound-looking cartons while some panels, trims or packaging have experienced cold and humidity changes. The importer needs an arrival protocol that preserves evidence and keeps damaged or wet material out of the installation queue.',
      answer: 'Document the load and packaging on arrival, isolate wet or damaged cartons, allow product and room conditions to stabilize according to the exact manufacturer instructions, then approve a sample before installation.',
      sections: [
        ['Plan the shipment as an assembly of goods', 'Record each panel length, carton type, pallet arrangement, trims and adhesives in the packing plan. The IMO/ILO/UNECE CTU Code is a non-mandatory practice guide for packing and securing cargo transport units. It is a logistics reference, not a certification of Luvie products. Ask who checks container condition, protects long edges and records the loading pattern before dispatch.'],
        ['Inspect before moving cartons into warm rooms', 'At delivery, photograph seals, vehicle or container condition, pallet position, carton labels, wet marks, tears and crushing before unloading changes the evidence. Count packages against the packing list and separate exceptions. If a carton is damp, do not hide it inside a finished room or immediately install its contents. Record a joint inspection and follow the purchase agreement for claims.'],
        ['Manage the transition from cold transport to indoor use', 'Cold surfaces can collect condensation when exposed to warmer humid indoor air. The U.S. EPA describes this general moisture mechanism; it does not prescribe a universal waiting time for every panel. Keep cartons protected and consult the current instructions for the specific panel, adhesive and substrate. Confirm room temperature and humidity are within those instructions before opening, measuring, cutting or fixing.'],
        ['Recheck the substrate and the golden sample', 'Winter construction may include wet plaster, new screeds, unheated storage and changing humidity. Inspect the actual wall for dryness, flatness, contamination and movement. Compare random panels from the delivery with the approved golden sample for shade, profile, dimensions and damage. A visual pass does not replace a project-required fire or emissions test for the exact product.'],
        ['Release one test area before full installation', 'Install a small area with the specified joints, trims and fixing method. Review alignment, corner detail and cleaning under the project lighting. Only release the bulk area once the architect or buyer accepts the result and any transport exceptions are resolved. Keep carton codes and photos so a later issue can be traced to a shipment or batch.'],
      ],
      closing: 'Share destination city, transport route, storage conditions and chosen model to request the current packing and installation information.',
    },
    es: {
      title: 'Paneles de pared a Uzbekistán en invierno: recepción | Luvie',
      description: 'Lista de recepción invernal para paneles destinados a Uzbekistán: revise empaque, humedad, transición térmica, muestras y soporte antes del montaje.',
      heading: 'Paneles enviados a Uzbekistán en invierno: ¿qué revisar antes de instalarlos?',
      lead: 'Los cartones pueden llegar aparentemente intactos después de cambios de frío y humedad. El importador necesita un protocolo de recepción que preserve pruebas y separe material mojado o dañado.',
      answer: 'Documente carga y empaque, aísle excepciones, estabilice material y sala según las instrucciones del fabricante y apruebe una muestra antes del montaje.',
      sections: [
        ['Planifique la carga completa', 'Registre largos, cartones, pallets, molduras y adhesivos. El Código CTU de IMO, OIT y UNECE ofrece buenas prácticas no obligatorias para empaque y sujeción de unidades de transporte. Es una referencia logística, no una certificación de Luvie. Defina quién revisa contenedor, bordes y patrón de carga.'],
        ['Inspeccione antes de mover la mercancía', 'Al recibir, fotografíe precintos, vehículo, posición de pallets, etiquetas, manchas húmedas, roturas y aplastamientos. Cuente bultos frente a la lista de empaque y separe diferencias. Un cartón mojado no debe ocultarse en una habitación terminada ni instalarse inmediatamente. Registre una inspección conjunta y siga el contrato para reclamaciones.'],
        ['Gestione el paso del frío al interior', 'Las superficies frías pueden condensar humedad al entrar en aire interior más cálido. La EPA explica el mecanismo general, pero no fija un plazo universal para todos los paneles. Proteja los cartones y siga las instrucciones actuales de panel, adhesivo y soporte. Compruebe temperatura y humedad de la sala antes de abrir, cortar o fijar.'],
        ['Revise base y muestra patrón', 'La obra invernal puede tener yeso húmedo, almacenes sin calefacción y humedad variable. Inspeccione sequedad, planeidad, suciedad y movimiento del muro. Compare paneles aleatorios con la muestra aprobada en tono, perfil y medidas. Una inspección visual no sustituye pruebas exigidas para el producto exacto.'],
        ['Libere un área de prueba', 'Instale una zona pequeña con juntas, molduras y fijación especificadas. Evalúe alineación, esquinas y limpieza con la iluminación real. Continúe solo tras aceptar el resultado y resolver excepciones de transporte. Guarde códigos de cartón y fotografías para trazabilidad.'],
      ],
      closing: 'Indique ciudad de destino, ruta, almacenamiento y modelo para solicitar información actual de empaque y montaje.',
    },
    'pt-br': {
      title: 'Painéis para o Uzbequistão no inverno: recebimento | Luvie',
      description: 'Checklist de chegada no inverno para painéis enviados ao Uzbequistão: embalagem, umidade, mudança de temperatura, amostras e base de instalação.',
      heading: 'Painéis entregues ao Uzbequistão no inverno: o que fazer antes da instalação?',
      lead: 'Caixas podem parecer boas após mudanças de frio e umidade no trajeto. O importador precisa de uma rotina de chegada que preserve evidências e separe material molhado ou danificado.',
      answer: 'Documente carga e embalagem, isole exceções, estabilize produto e ambiente conforme instruções do fabricante e aprove uma amostra antes de instalar.',
      sections: [
        ['Planeje todos os itens da carga', 'Registre comprimento dos painéis, caixas, pallets, arremates e adesivos. O Código CTU da IMO, OIT e UNECE reúne boas práticas não obrigatórias para embalar e fixar unidades de transporte. É referência logística, não certificação Luvie. Defina quem verifica o contêiner, protege as bordas e fotografa o carregamento.'],
        ['Inspecione antes de levar as caixas à obra', 'Na chegada, fotografe lacres, veículo, pallets, etiquetas, marcas de água, rasgos e amassados. Compare volumes com o packing list e separe divergências. Não esconda caixas molhadas num ambiente acabado nem instale logo o conteúdo. Registre inspeção conjunta e siga o contrato para eventuais reclamações.'],
        ['Administre a mudança do frio para o interior', 'Superfícies frias podem condensar umidade ao encontrar ar interno mais quente. A EPA descreve esse mecanismo geral, sem estabelecer tempo de espera universal para cada painel. Proteja as caixas e siga as instruções atuais do painel, adesivo e substrato. Confira temperatura e umidade antes de abrir, cortar ou fixar.'],
        ['Revise base e amostra padrão', 'A obra no inverno pode ter reboco úmido, depósito sem aquecimento e umidade variável. Confira secura, planicidade, limpeza e movimentação da parede. Compare painéis da entrega à amostra aprovada quanto a cor, perfil, medidas e danos. Inspeção visual não substitui ensaio exigido para o produto específico.'],
        ['Libere uma pequena área', 'Monte uma zona de teste com juntas, arremates e fixação previstos. Avalie alinhamento, cantos e limpeza sob a iluminação real. Amplie apenas após aceite e resolução das exceções de transporte. Guarde códigos das caixas e fotos para rastreabilidade.'],
      ],
      closing: 'Informe cidade, rota, armazenamento e modelo para solicitar orientações atuais de embalagem e instalação.',
    },
    ar: {
      title: 'ألواح الجدران إلى أوزبكستان شتاءً: فحص الاستلام | Luvie',
      description: 'قائمة استلام شتوية لألواح الجدران المرسلة إلى أوزبكستان: افحص التغليف والرطوبة وتغير الحرارة والعينات والقاعدة قبل التركيب.',
      heading: 'وصول ألواح الجدران إلى أوزبكستان شتاءً: ماذا تفعل قبل التركيب؟',
      lead: 'قد تبدو الصناديق سليمة رغم تعرض الألواح والزوايا والتغليف لتغيرات البرد والرطوبة أثناء النقل. يحتاج المستورد إلى إجراء استلام يحفظ الأدلة ويعزل المواد المبللة أو المتضررة.',
      answer: 'وثّق الحمولة والتغليف عند الوصول، واعزل الصناديق المتضررة، واتبع تعليمات الطراز لتكييف المادة والمكان، واعتمد نموذج تركيب قبل العمل الكامل.',
      sections: [
        ['خطط لكل عناصر الشحنة', 'سجّل طول الألواح ونوع الصناديق وترتيب المنصات والزوايا والمواد اللاصقة. يقدم دليل CTU الصادر عن IMO وILO وUNECE ممارسات غير إلزامية لتعبئة وحدات النقل وتثبيتها. هو مرجع لوجستي لا شهادة لمنتجات Luvie. حدد من يفحص الحاوية ويحمي الأطراف ويوثق ترتيب التحميل.'],
        ['افحص قبل نقل الصناديق إلى الغرف الدافئة', 'صوّر الأختام والمركبة ومواضع المنصات والملصقات وآثار الماء والتمزق والانضغاط عند الوصول. طابق العدد مع قائمة التعبئة واعزل الاستثناءات. لا تُخف صندوقاً رطباً في غرفة منتهية ولا تركّب محتوياته فوراً. سجّل فحصاً مشتركاً واتبع العقد في المطالبات.'],
        ['أدر الانتقال من البرد إلى الداخل', 'قد يتكاثف بخار الماء على سطح بارد عند دخوله هواءً داخلياً أدفأ. تشرح EPA الآلية العامة لكنها لا تفرض مدة انتظار موحدة لكل لوح. احم الصناديق واتبع تعليمات اللوح واللاصق والقاعدة المحددة. تحقق من حرارة المكان ورطوبته قبل الفتح أو القص أو التثبيت.'],
        ['راجع القاعدة والعينة المعتمدة', 'قد تحتوي أعمال الشتاء على جص رطب أو تخزين غير مدفأ أو رطوبة متغيرة. افحص جفاف الجدار واستواءه ونظافته وحركته. قارن ألواحاً عشوائية من الشحنة بالعينة المعتمدة في اللون والمقطع والأبعاد والتلف. الفحص البصري لا يحل محل اختبارات المشروع المطلوبة للطراز نفسه.'],
        ['اعتمد مساحة اختبار', 'ركّب مساحة صغيرة بالفواصل والزوايا وطريقة التثبيت المحددة. راجع الاستقامة والتفاصيل والتنظيف تحت إضاءة المشروع. لا تبدأ كامل المساحة قبل قبول النتيجة ومعالجة استثناءات النقل. احتفظ برموز الصناديق والصور للتتبع.'],
      ],
      closing: 'أرسل مدينة الوجهة ومسار النقل وظروف التخزين والطراز لطلب معلومات التعبئة والتركيب الحالية.',
    },
  },
];

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const route = (locale, file) => `${locales[locale].prefix}/articles/${file}`;
const asset = (file) => `${base}/assets/articles/${file}`;
const home = (locale) => `${locales[locale].prefix}/`;
const localProduct = (locale, product) => `${locales[locale].prefix}${product}`;
const schema = (guide, locale, item) => JSON.stringify({ '@context': 'https://schema.org', '@graph': [
  { '@type': 'Organization', '@id': `${base}/#organization`, name: 'Luvie Industry', url: `${base}/`, logo: `${base}/assets/brand/luvie-logo.webp` },
  { '@type': 'Article', headline: item.heading, description: item.description, inLanguage: locales[locale].html, datePublished: date, dateModified: date, image: asset(guide.image), author: { '@id': `${base}/#organization` }, publisher: { '@id': `${base}/#organization` }, mainEntityOfPage: `${base}${route(locale, guide.file)}`, citation: [guide.source] },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: locales[locale].home, item: `${base}${home(locale)}` }, { '@type': 'ListItem', position: 2, name: locales[locale].resources, item: `${base}${locales[locale].prefix}/articles/` }, { '@type': 'ListItem', position: 3, name: item.heading, item: `${base}${route(locale, guide.file)}` }] },
] });

function html(guide, locale) {
  const labels = locales[locale];
  const item = guide[locale];
  const url = `${base}${route(locale, guide.file)}`;
  const alternates = Object.keys(locales).map((code) => `<link rel="alternate" hreflang="${locales[code].html}" href="${base}${route(code, guide.file)}">`).join('');
  const switches = Object.keys(locales).map((code) => `<a href="${route(code, guide.file)}" lang="${locales[code].html}"${code === locale ? ' aria-current="page"' : ''}>${({ en: 'English', es: 'Español', 'pt-br': 'Português (Brasil)', ar: 'العربية' })[code]}</a>`).join(' ');
  const topics = guide.related.map((file) => {
    const other = guides.find((entry) => entry.file === file);
    const localizedTarget = `${locales[locale].prefix}/articles/${file}`;
    const target = locale === 'en' ? file : other || fs.existsSync(path.join(root, localizedTarget.slice(1))) ? localizedTarget : `/articles/${file}`;
    const text = other ? other[locale].heading : file.replaceAll('-', ' ').replace('.html', '');
    return `<a href="${target}">${esc(text)}</a>`;
  }).join(' ');
  const sections = item.sections.map(([heading, paragraph]) => `<section><h2>${esc(heading)}</h2><p>${esc(paragraph)}</p></section>`).join('\n');
  return `<!doctype html><html lang="${labels.html}" dir="${labels.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(item.title)}</title><meta name="description" content="${esc(item.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="Luvie Industry"><meta name="content-series" content="2026-daily"><meta property="article:published_time" content="${date}"><meta property="article:modified_time" content="${date}"><link rel="canonical" href="${url}">${alternates}<meta property="og:type" content="article"><meta property="og:site_name" content="Luvie Industry"><meta property="og:title" content="${esc(item.title)}"><meta property="og:description" content="${esc(item.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${asset(guide.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(item.title)}"><meta name="twitter:description" content="${esc(item.description)}"><meta name="twitter:image" content="${asset(guide.image)}"><link rel="icon" href="/assets/brand/favicon-32.png"><link rel="stylesheet" href="/assets/daily-guides.css"><script type="application/ld+json">${schema(guide, locale, item)}</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-VCLMP6Q5KJ"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-VCLMP6Q5KJ');</script><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1331142262420820');fbq('track','PageView');</script></head><body><header class="site-header"><div class="wrap nav"><a class="brand" href="${home(locale)}">LUVIE INDUSTRY</a><a href="${locales[locale].prefix}/articles/">${labels.resources}</a><a class="contact" href="https://wa.me/306947135317">${labels.contact}</a></div></header><main class="wrap"><nav class="languages" aria-label="Language versions">${switches}</nav><article><nav class="breadcrumbs"><a href="${home(locale)}">${labels.home}</a> / <a href="${locales[locale].prefix}/articles/">${labels.resources}</a></nav><p class="eyebrow">Luvie Industry · ${date}</p><h1>${esc(item.heading)}</h1><p class="lead">${esc(item.lead)}</p><figure><img src="/assets/articles/${guide.image}" alt="${esc(item.heading)}" width="1200" height="800"><figcaption>${labels.imageNote}</figcaption></figure><div class="answer"><strong>${locale === 'en' ? 'Short answer' : locale === 'es' ? 'Respuesta breve' : locale === 'pt-br' ? 'Resposta curta' : 'إجابة مختصرة'}</strong><p>${esc(item.answer)}</p></div><!-- topic-cluster-links:start --><nav class="related" aria-label="Related buyer guides"><strong>${labels.more}</strong><p>${topics}</p></nav><!-- topic-cluster-links:end --><!-- authority-evidence:start --><aside class="authority-evidence"><strong>${labels.evidence}</strong><p><a href="${guide.source}" rel="noopener noreferrer external" target="_blank">${guide.source.includes('siscomex') ? 'Brazilian Siscomex' : guide.source.includes('unece') ? 'IMO/ILO/UNECE CTU Code' : 'U.S. EPA moisture-control guidance'}</a>. ${labels.note}</p></aside><!-- authority-evidence:end -->${sections}<section><h2>${locale === 'en' ? 'Next step' : locale === 'es' ? 'Siguiente paso' : locale === 'pt-br' ? 'Próximo passo' : 'الخطوة التالية'}</h2><p>${esc(item.closing)}</p><p><a href="${guide.catalog}">${labels.catalog}</a> · <a href="${localProduct(locale, guide.product)}">${labels.product}</a></p></section><div class="cta"><a href="https://wa.me/306947135317?text=Hello%20Luvie%2C%20I%20would%20like%20a%20current%20sample%20and%20specification.">${labels.contact}</a></div></article></main><footer class="wrap footer">Luvie Industry · <a href="mailto:jinsburg@luvieindustry.com">jinsburg@luvieindustry.com</a> · +30 6947135317</footer></body></html>\n`;
}

for (const guide of guides) {
  if (!fs.existsSync(path.join(root, 'assets/articles', guide.image))) throw new Error(`Missing image ${guide.image}`);
  for (const locale of Object.keys(locales)) {
    const target = path.join(root, route(locale, guide.file).slice(1));
    if (fs.existsSync(target)) throw new Error(`Refusing to overwrite ${target}`);
  }
}
for (const guide of guides) for (const locale of Object.keys(locales)) {
  const target = path.join(root, route(locale, guide.file).slice(1));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html(guide, locale));
}
for (const locale of ['es', 'pt-br', 'ar']) {
  const target = path.join(root, locale, 'articles/index.html');
  let page = fs.readFileSync(target, 'utf8');
  const cards = guides.map((guide) => `<a class="article-card" href="${route(locale, guide.file)}"><img src="/assets/articles/${guide.image}" alt="${esc(guide[locale].heading)}" loading="lazy"><div><span>${date}</span><h2>${esc(guide[locale].heading)}</h2><p>${esc(guide[locale].description)}</p></div></a>`).join('\n');
  page = page.replace('</section>\n</main>', `${cards}\n</section>\n</main>`);
  if (!page.includes(route(locale, guides[0].file))) throw new Error(`Could not update ${target}`);
  fs.writeFileSync(target, page);
}
let sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const guide of guides) for (const locale of Object.keys(locales)) {
  const url = `${base}${route(locale, guide.file)}`;
  if (sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`Duplicate sitemap URL ${url}`);
  sitemap = sitemap.replace('</urlset>', `    <url><loc>${url}</loc><lastmod>${date}</lastmod><priority>0.7</priority></url>\n</urlset>`);
}
sitemap = sitemap.replace(/(<loc>https:\/\/luvieindustry\.com\/<\/loc>\s*<lastmod>)[^<]+/, `$1${date}`);
sitemap = sitemap.replace(/(<loc>https:\/\/luvieindustry\.com\/articles\/<\/loc>\s*<lastmod>)[^<]+/, `$1${date}`);
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
console.log(`Created ${guides.length} English guides and ${guides.length * 3} localized guides for ${date}`);
