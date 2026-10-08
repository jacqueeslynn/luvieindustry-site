"""Reviewed technical phrases, applied to published text and source caches."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parent.parent
PHRASES={
 'es':{'compradorr':'comprador','costo de aterrizaje':'costo total puesto en destino','tratamiento facial':'tratamiento de la superficie','cobertura facial':'cobertura útil','cita utilizable':'cotización útil','Evidencia de incendio':'Documentación de reacción al fuego','evidencia de incendio':'documentación de reacción al fuego','Guía del comprado':'Guía del comprador','tablero de humo':'tablero de inspiración'},
 'pt-br':{'custo de desembarque':'custo total posto no destino','Custo de desembarque':'Custo total posto no destino','tratamento facial':'acabamento superficial','citação utilizável':'cotação útil','“Fireproof WPC”':'“WPC à prova de fogo”'},
 'ar':{'تكلفة الهبوط':'التكلفة الإجمالية بعد الاستيراد','تكلفة هبوط':'التكلفة الإجمالية بعد الاستيراد','معالجة الوجه':'معالجة السطح','حدد مسار الرمز':'حدد متطلبات الكود المحلي','الاقتباس القابل للاستخدام':'عرض السعر القابل للمقارنة'}}
def polish(text,mapping):
 for before,after in mapping.items(): text=re.sub(r'(?<!\w)'+re.escape(before)+r'(?!\w)',after,text)
 return text
for code,mapping in PHRASES.items():
 for file in (ROOT/code).rglob('*.html'):
  old=file.read_text();new=polish(old,mapping)
  if new!=old:file.write_text(new)
 cache=ROOT/'content/translations'/f'{code}.json';data=json.loads(cache.read_text())
 cache.write_text(json.dumps({k:polish(v,mapping) for k,v in data.items()},ensure_ascii=False,indent=2)+'\n')

# Existing supplier catalog title is a title, not an untranslated body paragraph.
for code,replacement in {'pt-br':'catálogo de painéis de parede','ar':'كتالوج ألواح الجدران'}.items():
 p=ROOT/code/'articles/pvc-wall-panels-humid-areas.html';p.write_text(p.read_text().replace('Wall Panel',replacement))
