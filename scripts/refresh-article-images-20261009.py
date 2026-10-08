"""Replace three overused article heroes without altering their publication dates."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
items={
 'choose-pvc-wall-panel-thickness-profile.html':('pvc-panel-profile.webp','profile-comparison-20261009.webp'),
 'evaluate-wall-panel-samples.html':('pvc-panel-texture.webp','sample-review-20261009.webp'),
 'prevent-container-condensation-wall-panels.html':('export-packaging.webp','container-moisture-20261009.webp'),
}
captions={
 '':'AI-generated editorial illustration; not a product photograph, test result or loading instruction. Confirm the actual model and procedure separately.',
 'es':'Ilustración editorial generada con IA; no es una foto de producto, un resultado de ensayo ni una instrucción de carga. Confirme el modelo y el procedimiento reales.',
 'pt-br':'Ilustração editorial gerada por IA; não é foto de produto, resultado de ensaio ou instrução de carregamento. Confirme o modelo e o procedimento reais.',
 'ar':'صورة تحريرية مولدة بالذكاء الاصطناعي؛ ليست صورة منتج أو نتيجة اختبار أو تعليمات تحميل. تحقق من الطراز والإجراء الفعليين بصورة مستقلة.',
}
for locale,caption in captions.items():
 folder=ROOT/locale/'articles'
 for file,(old,new) in items.items():
  p=folder/file; text=p.read_text().replace(old,new)
  text=re.sub(r'(<figure\b[^>]*>.*?<figcaption>).*?(</figcaption>)',lambda m:m[1]+caption+m[2],text,count=1,flags=re.S)
  # Describe the illustration rather than presenting it as packing evidence.
  text=re.sub(r'(<figure\b[^>]*>\s*<img\b[^>]*\balt=")[^"]*',lambda m:m[1]+caption,text,count=1,flags=re.S)
  p.write_text(text)
  hub=folder/'index.html'; source=hub.read_text()
  def card(m):
   value=m[0]
   return value.replace(old,new) if file in value.split('>',1)[0] else value
  source=re.sub(r'<a\b[^>]*class="article-card"[^>]*>.*?</a>',card,source,flags=re.S)
  hub.write_text(source)
