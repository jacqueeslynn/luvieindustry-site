"""Localize inquiry prefills and structured URLs; use real titles on related links."""
from pathlib import Path
import json,re
from urllib.parse import urlsplit,urlunsplit,parse_qs,urlencode,urljoin
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parent.parent
BASE='https://luvieindustry.com'
INQUIRY={
 'es':'Hola, Luvie. Quisiera solicitar una muestra y las especificaciones actuales del producto seleccionado.',
 'pt-br':'Olá, Luvie. Gostaria de solicitar uma amostra e as especificações atuais do produto selecionado.',
 'ar':'مرحباً Luvie، أود طلب عينة والمواصفات الحالية للمنتج الذي اخترته.'}
for code,message in INQUIRY.items():
 for page in (ROOT/code).rglob('*.html'):
  text=page.read_text()
  def link(m):
   tag=m[0]; h=re.search(r'href="([^"]+)"',tag)
   if not h:return tag
   parsed=urlsplit(h[1]);q=parse_qs(parsed.query)
   if parsed.netloc=='wa.me' and q.get('text',[''])[0].startswith('Hello'):
    tag=tag.replace(h[0],f'href="{urlunsplit((parsed.scheme,parsed.netloc,parsed.path,urlencode({"text":message}),""))}"')
   return tag
  text=re.sub(r'<a\b[^>]*>',link,text)
  def schema(m):
   data=json.loads(m[1])
   def walk(item):
    if isinstance(item,list):return [walk(x) for x in item]
    if isinstance(item,dict):
     result={}
     for k,v in item.items():
      if k in ('url','item','mainEntityOfPage','@id') and isinstance(v,str) and v.startswith((BASE+'/products/',BASE+'/articles/')):
       dest=f'/{code}'+v[len(BASE):]
       disk=ROOT/dest.lstrip('/')
       if disk.exists():v=BASE+dest
      result[k]=walk(v)
     return result
    return item
   return '<script type="application/ld+json">'+json.dumps(walk(data),ensure_ascii=False,separators=(',',':'))+'</script>'
  # Avoid reformatting HTML itself: dated publishers test exact translated body.
  text=re.sub(r'<script type="application/ld\+json">([\s\S]*?)</script>',schema,text)
  if 'topic-cluster-links:start' in text:
   def related(m):
    href,label=m.groups();dest=urlsplit(urljoin(BASE+'/'+page.relative_to(ROOT).as_posix(),href)).path
    if not dest.startswith('/'+code+'/articles/'):return m[0]
    file=ROOT/dest.lstrip('/')
    if not file.exists():return m[0]
    title=BeautifulSoup(file.read_text(),'html.parser').h1
    return f'<a href="{href}">{title.decode_contents()}</a>' if title else m[0]
   text=re.sub(r'(<!-- topic-cluster-links:start -->)([\s\S]*?)(<!-- topic-cluster-links:end -->)',lambda m:m[1]+re.sub(r'<a href="([^"]+\.html)">([^<]+)</a>',related,m[2])+m[3],text)
  page.write_text(text)
print('Localized schema, inquiry prefills and related guide labels')
