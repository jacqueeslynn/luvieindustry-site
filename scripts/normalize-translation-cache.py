"""Apply reviewed B2B terminology corrections to machine translation caches."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPLACEMENTS = {
    "es": {
        "or": "o", "Manufacturing": "Fabricación", "Haining Luvie Import & Export Co., Ltd.": "Haining Luvie Import & Export Co., Ltd.",
        "costo de la construcción de la tierra": "costo total puesto en destino",
        "costo de aterrizaje": "costo total puesto en destino",
        "costo de desembarque": "costo total puesto en destino",
        "costo de desembarco": "costo total puesto en destino",
        "costo desembarcado": "costo total puesto en destino",
        "costo de tierra": "costo total puesto en destino",
        "coste de aterrizaje": "costo total puesto en destino",
        "promesa de acciones": "promesa de disponibilidad",
        "compradoes": "compradores", "distribuidoes": "distribuidores", "impotadoes": "importadores",
        "contenedoes": "contenedores", "instaladoes": "instaladores", "proveedoes": "proveedores",
        "sujetadoes": "sujetadores", "selladoes": "selladores", "operadoes": "operadores",
    },
    "pt-br": {
        "Manufacturing": "Fabricação", "Haining Luvie Import & Export Co., Ltd.": "Haining Luvie Import & Export Co., Ltd.",
        "custo de aterrissagem": "custo total posto no destino",
        "custo de desembarque": "custo total posto no destino",
        "custo de desembarco": "custo total posto no destino",
        "custo da terra": "custo total posto no destino",
        "custo aterrado": "custo total posto no destino",
    },
    "ar": {
        "Haining Luvie Import & Export Co., Ltd.": "Haining Luvie Import & Export Co., Ltd.",
        "لوفي": "Luvie",
        "صناعة Luvie": "Luvie Industry",
        "تكلفة الهبوط": "التكلفة الإجمالية بعد الاستيراد",
        "تكلفة الأرض": "التكلفة الإجمالية بعد الاستيراد",
        "من الفضاء إلى المواد، على الفور": "من تصور المساحة إلى اختيار المواد فورًا",
        "من الفضاء إلى المواد": "من تصور المساحة إلى اختيار المواد",
    },
}
OVERRIDES = {
    "es": {
        "By Luvie Industry": "Por Luvie Industry",
        "By Luvie Industry · Buyer resource": "Por Luvie Industry · Guía para compradores",
        "By Luvie Industry · Reviewed 24 August 2026": "Por Luvie Industry · Revisado el 24 de agosto de 2026",
        "Landed cost": "Costo total puesto en destino", "Resources": "Guías",
        "Bedroom Feature Wall Panels: Layout, Lighting and Ordering": "Paneles decorativos para el dormitorio: diseño, iluminación y pedido",
        "Gulf Hotel Wall Panels: Check Fire Evidence Before Approving the Finish": "Paneles de pared para hoteles del Golfo: revise las pruebas de reacción al fuego antes de aprobar el acabado",
        "PVC Wall Panels in Direct Sun: A Hot-Climate Buyer Checklist": "Paneles de pared de PVC bajo sol directo: lista de verificación para climas cálidos",
        "Build a wall panel display that answers the buyer’s next question.": "Cómo montar un expositor de paneles que responda a las preguntas de los compradores",
        "Are PVC Wall Panels Good? Uses, Limits and Buyer Checks": "¿Son adecuados los paneles de pared de PVC? Usos, límites y verificaciones del comprador",
        "How can buyers verify a low VOC wall panel claim?": "¿Cómo verificar la afirmación de bajas emisiones de COV de un panel de pared?",
        "Gulf Hotel Wall Panels: Fire Evidence Checklist | Luvie": "Paneles para hoteles del Golfo: pruebas de reacción al fuego | Luvie",
        "PVC Ceiling Installation in Brazil: Support, Gaps & Buyer Checks | Luvie": "Instalación de cielorraso de PVC en Brasil: soportes y juntas | Luvie",
        "PVC Wall Panels in Direct Sun: Hot-Climate Buyer Checks | Luvie": "Paneles de PVC bajo sol directo: guía para climas cálidos | Luvie",
        "Import PVC Wall Panels to Uzbekistan: 2026 Buyer Checklist | Luvie": "Importar paneles de PVC a Uzbekistán: guía 2026 | Luvie",
        "PVC Wall Panels in Coastal Humid Interiors: Buyer Guide | Luvie": "Paneles de PVC para interiores costeros húmedos | Luvie",
    },
    "pt-br": {
        "Landed cost": "Custo total posto no destino", "Resources": "Guias",
        "Gulf Hotel Wall Panels: Check Fire Evidence Before Approving the Finish": "Painéis de parede para hotéis no Golfo: verifique os laudos de reação ao fogo antes de aprovar o acabamento",
        "PVC Ceiling Installation in Brazil: What Buyers Should Check Before Ordering": "Instalação de forro de PVC no Brasil: o que verificar antes de comprar",
        "PVC Wall Panels in Direct Sun: A Hot-Climate Buyer Checklist": "Painéis de parede de PVC sob sol direto: checklist para climas quentes",
        "Build a wall panel display that answers the buyer’s next question.": "Como montar uma exposição de painéis que responda às dúvidas do comprador",
        "Are PVC Wall Panels Good? Uses, Limits and Buyer Checks": "Painéis de parede de PVC valem a pena? Usos, limites e verificações do comprador",
        "Gulf Hotel Wall Panels: Fire Evidence Checklist | Luvie": "Painéis para hotéis no Golfo: laudos de reação ao fogo | Luvie",
        "PVC Ceiling Installation in Brazil: Support, Gaps & Buyer Checks | Luvie": "Instalação de forro de PVC no Brasil: estrutura e folgas | Luvie",
        "PVC Wall Panels in Direct Sun: Hot-Climate Buyer Checks | Luvie": "Painéis de PVC sob sol direto: guia para climas quentes | Luvie",
        "Import PVC Wall Panels to Uzbekistan: 2026 Buyer Checklist | Luvie": "Importar painéis de PVC para o Uzbequistão: guia 2026 | Luvie",
        "PVC Wall Panels in Coastal Humid Interiors: Buyer Guide | Luvie": "Painéis de PVC para interiores úmidos no litoral | Luvie",
    },
    "ar": {
        "Landed cost": "التكلفة الإجمالية بعد الاستيراد",
        "By Luvie Industry · Buyer resource": "بقلم Luvie Industry · دليل للمشترين",
        "PVC vs WPC Wall Panels: Which Is Better for Your Market?": "ألواح الجدران PVC أم WPC: أيهما أنسب لسوقك؟",
        "Bedroom Feature Wall Panels: Layout, Lighting and Ordering": "ألواح الجدران الزخرفية لغرفة النوم: التصميم والإضاءة والطلب",
        "Gulf Hotel Wall Panels: Check Fire Evidence Before Approving the Finish": "ألواح الجدران لفنادق الخليج: تحقق من أدلة اختبار الحريق قبل اعتماد التشطيب",
        "PVC Wall Panels in Direct Sun: A Hot-Climate Buyer Checklist": "ألواح الجدران PVC تحت أشعة الشمس المباشرة: قائمة فحص للمناخ الحار",
        "PVC Ceiling Installation in Brazil: What Buyers Should Check Before Ordering": "تركيب أسقف PVC في البرازيل: ما الذي يجب فحصه قبل الطلب",
        "Build a wall panel display that answers the buyer’s next question.": "كيف تصمم عرضًا لألواح الجدران يجيب عن أسئلة المشتري",
        "Are PVC Wall Panels Good? Uses, Limits and Buyer Checks": "هل ألواح الجدران PVC مناسبة؟ الاستخدامات والقيود وفحوصات المشتري",
        "How do importers calculate wall panel landed cost per square metre?": "كيف يحسب المستوردون التكلفة الإجمالية لألواح الجدران بعد الاستيراد لكل متر مربع؟",
        "FOB vs CIF for Wall Panel Orders: Which Is Better for Buyers?": "FOB مقابل CIF لطلبات ألواح الجدران: أيهما أنسب للمشتري؟",
        "Hotel Corridor Wall Panels: Fluted Panel Project Guide": "ألواح الجدران لممرات الفنادق: دليل تخطيط الألواح المخددة",
        "How can buyers verify a low VOC wall panel claim?": "كيف يتحقق المشترون من ادعاء انخفاض انبعاثات المركبات العضوية المتطايرة؟",
        "Gulf Hotel Wall Panels: Fire Evidence Checklist | Luvie": "ألواح لفنادق الخليج: دليل فحص أدلة الحريق | Luvie",
        "PVC Ceiling Installation in Brazil: Support, Gaps & Buyer Checks | Luvie": "تركيب أسقف PVC في البرازيل: الدعامات وفواصل التمدد | Luvie",
        "PVC Wall Panels in Direct Sun: Hot-Climate Buyer Checks | Luvie": "ألواح PVC تحت الشمس المباشرة: دليل المناخ الحار | Luvie",
        "Import PVC Wall Panels to Uzbekistan: 2026 Buyer Checklist | Luvie": "استيراد ألواح PVC إلى أوزبكستان: دليل 2026 | Luvie",
        "PVC Wall Panels in Coastal Humid Interiors: Buyer Guide | Luvie": "ألواح PVC للبيئات الداخلية الساحلية الرطبة | Luvie",
    },
}

for locale, replacements in REPLACEMENTS.items():
    path = ROOT / "content" / "translations" / f"{locale}.json"
    cache = json.loads(path.read_text())
    changed = 0
    for source, target in cache.items():
        revised = target
        for before, after in replacements.items():
            revised = revised.replace(before, after)
            revised = revised.replace(before[0].upper() + before[1:], after[0].upper() + after[1:])
        if source in OVERRIDES.get(locale, {}):
            revised = OVERRIDES[locale][source]
        if revised != target:
            cache[source] = revised
            changed += 1
    path.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n")
    print(f"{locale}: normalized {changed} cached strings")
