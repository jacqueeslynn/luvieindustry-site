"""Reviewed whole-word recovery for remnants of the historical or->o bug.

Never replace inside URLs, scripts or styles. Ambiguous valid words (tono,
sellado, mayo, note, distribuido) are deliberately excluded.
"""
import json,re
from pathlib import Path
from bs4 import BeautifulSoup,Comment,Doctype
ROOT=Path(__file__).resolve().parent.parent
CORRECT='accesorios forma información conformidad horas origen valor importantes decorativa orden bordes proveedor orientación coordinación decorativas normal borde proporcionan por mejora valoran acordar informe soporte meteorización ordene mejor minoristas orientado grosor exportación minorista importa laboratorio adornos transporte importar porque interior ordenar alrededor sujetador acordada olor contenedor tornillos informes color historia recortes entorno recorte categoría dorada posteriores proporcionar coordinada horario interiores decorativo importante normalmente calor categorías decoración aborda decorativos autorizado organizar absorbe vendedor menor exterior exteriores formato corte coordinado importación superior corta colores autoridad errores espesores ahorro correcto correcta correctos correctamente dormitorio comercial'.split()
WORDS={w.replace('or','o'):w for w in CORRECT if w.replace('or','o')!=w}
def repair(text):
    def word(m):
        source=m[0]; replacement=WORDS.get(source.lower(),source)
        return replacement[0].upper()+replacement[1:] if source[0].isupper() else replacement
    text=re.sub(r'\b[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+\b',word,text)
    for a,b in {'al por mayo':'al por mayor','al por meno':'al por menor','del comprado':'del comprador','el comprado':'el comprador','un comprado':'un comprador','para el comprado':'para el comprador','foo de PVC':'forro de PVC','Comparar like con like':'Compare ofertas equivalentes'}.items(): text=re.sub(r'\b'+re.escape(a)+r'\b',b,text)
    return text
def walk(data):
    if isinstance(data,str): return data if data.startswith(('http','/','mailto:')) else repair(data)
    if isinstance(data,list): return [walk(x) for x in data]
    if isinstance(data,dict): return {k:walk(v) for k,v in data.items()}
    return data
if __name__=='__main__':
    cache=ROOT/'content/translations/es.json'
    cache.write_text(json.dumps(walk(json.loads(cache.read_text())),ensure_ascii=False,indent=2)+'\n')
    count=0
    for page in (ROOT/'es').rglob('*.html'):
        html=page.read_text(); soup=BeautifulSoup(html,'html.parser')
        for node in list(soup.find_all(string=True)):
            if not isinstance(node,(Comment,Doctype)) and node.parent.name not in ('script','style'):
                node.replace_with(repair(str(node)))
        for tag in soup.find_all(True):
            for attr in ('content','alt','title','aria-label','placeholder'):
                if isinstance(tag.get(attr),str) and not tag[attr].startswith(('http','/')): tag[attr]=repair(tag[attr])
        for tag in soup.find_all('script',type='application/ld+json'):
            if tag.string: tag.string=json.dumps(walk(json.loads(tag.string)),ensure_ascii=False,separators=(',',':'))
        output=str(soup)+'\n'
        if output!=html: page.write_text(output);count+=1
    print(f'Recovered spelling in {count} pages and Spanish source cache')
