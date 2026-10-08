"""Apply the reviewed four-language buyer-first homepage, preserving forms."""
from pathlib import Path
from bs4 import BeautifulSoup, Comment
ROOT=Path(__file__).resolve().parent.parent
COPY={
 'en': ['Materials for considered spaces.','PVC & WPC wall panels for global buyers','Compare the profile. Review the finish. Confirm the details before you order.','Explore six material families, open the catalogs and build a shortlist with the exact samples and documents your project needs.','Profile reference','Panel profile from our product image library. Confirm the model and finish against a current sample.','Explore materials','View catalogs','More buying questions','Latest buyer guides','Read all guides'],
 'es': ['Materiales para espacios bien pensados.','Paneles PVC y WPC para su mercado','Compare el perfil y el acabado. Confirme los detalles antes de comprar.','Explore seis familias de materiales, consulte los catálogos y seleccione las muestras y los documentos que necesita su proyecto.','Referencia del perfil','Perfil de panel de nuestra biblioteca de productos. Confirme el modelo y el acabado con una muestra actual.','Explorar materiales','Ver catálogos','Más preguntas de compra','Últimas guías de compra','Ver todas las guías'],
 'pt-br': ['Materiais para espaços bem planejados.','Painéis PVC e WPC para o seu mercado','Compare o perfil e o acabamento. Confirme os detalhes antes de comprar.','Explore seis famílias de materiais, consulte os catálogos e selecione as amostras e os documentos de que seu projeto precisa.','Referência do perfil','Perfil de painel da nossa biblioteca de produtos. Confirme o modelo e o acabamento com uma amostra atual.','Explorar materiais','Ver catálogos','Mais perguntas de compra','Guias de compra recentes','Ver todos os guias'],
 'ar': ['مواد لمساحات مدروسة.','ألواح PVC وWPC لأسواقكم','قارن المقطع والتشطيب، وأكد التفاصيل قبل الطلب.','استكشف ست فئات من المواد، وافتح الكتالوجات، وحدد العينات والمستندات التي يحتاجها مشروعك.','مرجع للمقطع','مقطع لوح من مكتبة صور منتجاتنا. أكد الطراز والتشطيب بمقارنتهما بعينة حديثة.','استكشف المواد','عرض الكتالوجات','المزيد من أسئلة الشراء','أحدث أدلة الشراء','عرض جميع الأدلة']}
for code,c in COPY.items():
    prefix='' if code=='en' else '/'+code
    file=ROOT/(prefix.lstrip('/')+'/index.html').lstrip('/')
    soup=BeautifulSoup(file.read_text(),'html.parser')
    soup.body['class']=list(set(soup.body.get('class',[])+['buyer-first']))
    if not soup.find('link',href='/assets/home-editorial.css?v=20261008'):
        soup.head.append(soup.new_tag('link',rel='stylesheet',href='/assets/home-editorial.css?v=20261008'))
    hero=soup.select_one('.hero-stage')
    for redundant in hero.select('.hero-route,.hero-pills,.hero-proof,.trust-bar,.hero-media-topline,.hero-caption'):
        redundant.decompose()
    hero.select_one('.hero-lead').string=c[0]
    hero.h1.string=c[1]
    notes=hero.select('.hero-note')
    notes[0].string=c[2]; notes[1].string=c[3]
    actions=hero.select_one('.hero-actions'); actions.clear()
    for target,label,cls in [('#systems',c[6],'button'),('#catalog',c[7],'button-secondary')]:
        a=soup.new_tag('a',href=target,attrs={'class':cls,'data-view-target':target[1:]}); a.string=label; actions.append(a)
    media=hero.select_one('.hero-media'); media.clear()
    img=soup.new_tag('img',src='/assets/quote-product-images/image7.jpeg',alt=c[4],width='960',height='1280',loading='eager',fetchpriority='high'); media.append(img)
    caption=soup.new_tag('p',attrs={'class':'profile-caption'}); caption.string=c[5]; media.append(caption)
    strip=soup.select_one('.buyer-guide-strip')
    if strip and not strip.find('details'):
        extras=strip.find_all('a',recursive=False)[4:]
        details=soup.new_tag('details'); summary=soup.new_tag('summary');summary.string=c[8];details.append(summary)
        for a in extras: details.append(a.extract())
        strip.append(details)
    if not soup.find(id='latest-guides'):
        section=soup.new_tag('section',id='latest-guides',attrs={'class':'latest-guides','aria-labelledby':'latest-guides-title'})
        header=soup.new_tag('div',attrs={'class':'latest-guides-heading'})
        h=soup.new_tag('h2',id='latest-guides-title');h.string=c[9];header.append(h)
        a=soup.new_tag('a',href=prefix+'/articles/');a.string=c[10]+' ↗';header.append(a);section.append(header)
        section.append(Comment('latest-guides:start')); section.append(Comment('latest-guides:end'))
        hero.insert_after(section)
    file.write_text(str(soup).rstrip()+'\n')
print('Refined four homepages; forms and product facts preserved')
