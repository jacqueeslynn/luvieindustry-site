"""Connect all existing language counterparts without changing article dates."""
import importlib.util
import json
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, urljoin
from datetime import date
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent.parent
BASE='https://luvieindustry.com'
LANGS={'es':'es','pt-br':'pt-BR','ar':'ar'}
LABELS={'en':'English','es':'Español','pt-br':'Português (Brasil)','ar':'العربية'}
SPECIAL={'es':'panel-ranurado-pvc-pared.html','pt-br':'painel-ripado-pvc-parede.html','ar':'fluted-pvc-wall-panels.html'}
def localized(code,route):
    if route=='/articles/fluted-wall-panels-distributor-guide.html': return f'/{code}/articles/{SPECIAL[code]}'
    return f'/{code}{route}'
def pagepath(route): return ROOT/(route.lstrip('/')+('index.html' if route.endswith('/') else ''))
def alternates(route):
    pairs=[('en',route),*[(tag,localized(code,route)) for code,tag in LANGS.items()]]
    return '\n'.join(f'<link rel="alternate" hreflang="{tag}" href="{BASE}{target}">' for tag,target in pairs)

sources=[*sorted((ROOT/'articles').glob('*.html')),*sorted((ROOT/'products').glob('*.html'))]
routes=[]
for file in sources:
    route='/'+file.relative_to(ROOT).as_posix().replace('index.html','')
    routes.append(route)
    for code in LANGS:
        if not pagepath(localized(code,route)).exists(): raise RuntimeError(f'Missing {code}: {route}')
    # Preserve original English markup so existing publishing tests keep working.
    text=file.read_text()
    if 'hreflang="es"' not in text: text=text.replace('</head>',alternates(route)+'\n</head>',1)
    soup=BeautifulSoup(text,'html.parser')
    if not soup.select_one('nav.language-switch, nav.language-links, nav.languages'):
        links=''.join(f'<a href="{target}" lang="{tag}"'+(' aria-current="page"' if code=='en' else '')+f'>{LABELS[code]}</a>' for code,tag,target in [('en','en',route),*[(c,t,localized(c,route)) for c,t in LANGS.items()]])
        nav=f'<nav class="container language-switch language-links" aria-label="Language versions">{links}</nav>'
        text=text.replace('</header>','</header>'+nav,1)
    file.write_text(text)

for code in LANGS:
    for file in (ROOT/code).rglob('*.html'):
        text=file.read_text()
        def local_link(match):
            tag=match.group(0)
            # Language choices intentionally cross language boundaries.
            if re.search(r'\b(?:lang|hreflang)=',tag): return tag
            href=re.search(r'href="([^"]+)"',tag)
            if not href: return tag
            target=urlsplit(urljoin(BASE+'/'+file.relative_to(ROOT).as_posix(),href[1]))
            if target.netloc!='luvieindustry.com': return tag
            if target.path=='/' or target.path.startswith(('/articles/','/products/')):
                route=localized(code,target.path)
                if pagepath(route).exists():
                    value=urlunsplit(('','',route,target.query,target.fragment))
                    return tag.replace(href[0],f'href="{value}"')
            return tag
        text=re.sub(r'<a\b[^>]*>',local_link,text)
        # Remove now-obsolete English fallback disclosure after the route exists.
        if '/products/' in text:
            text=text.replace(' (en inglés)</a>','</a>').replace(' (em inglês)</a>','</a>').replace(' (بالإنجليزية)</a>','</a>')
        file.write_text(text)
    # Add the missing translated cards, using actual translated article metadata.
    hub=ROOT/code/'articles/index.html'
    html=hub.read_text(); soup=BeautifulSoup(html,'html.parser')
    cards=soup.select('a.article-card')
    if not cards: raise RuntimeError(f'No article grid in {hub}')
    grid=cards[0].parent
    known={urlsplit(urljoin(BASE+f'/{code}/articles/',a.get('href',''))).path for a in cards}
    for route in routes:
        if not route.startswith('/articles/') or route=='/articles/': continue
        dest=localized(code,route)
        if dest in known: continue
        article=BeautifulSoup(pagepath(dest).read_text(),'html.parser')
        card=soup.new_tag('a',href=dest,attrs={'class':'article-card'})
        image=article.find('meta',property='og:image')
        title=article.h1.get_text(' ',strip=True)
        if image:
            src=urlsplit(image['content']).path
            card.append(soup.new_tag('img',src=src,alt=title,loading='lazy'))
        body=soup.new_tag('div'); card.append(body)
        published=article.find('meta',property='article:published_time')
        stamp=soup.new_tag('span'); stamp.string=published.get('content','') if published else ''; body.append(stamp)
        heading=soup.new_tag('h2'); heading.string=title; body.append(heading)
        desc=article.find('meta',attrs={'name':'description'})
        p=soup.new_tag('p'); p.string=desc.get('content','') if desc else ''; body.append(p)
        grid.append(card)
    hub.write_text(str(soup).rstrip()+'\n')

ns='http://www.sitemaps.org/schemas/sitemap/0.9'; ET.register_namespace('',ns)
tree=ET.parse(ROOT/'sitemap.xml'); root=tree.getroot()
seen={}
for node in list(root):
 address=node.findtext(f'{{{ns}}}loc')
 if address in seen:
  previous=seen[address].find(f'{{{ns}}}lastmod');current=node.find(f'{{{ns}}}lastmod')
  if previous is not None and current is not None: previous.text=max(previous.text or '',current.text or '')
  root.remove(node)
 else:seen[address]=node
known={x.text for x in root.findall(f'{{{ns}}}url/{{{ns}}}loc')}
count=0
for route in routes:
    for code in LANGS:
        address=BASE+localized(code,route)
        if address in known: continue
        node=ET.SubElement(root,f'{{{ns}}}url')
        ET.SubElement(node,f'{{{ns}}}loc').text=address
        ET.SubElement(node,f'{{{ns}}}lastmod').text=date.today().isoformat()
        ET.SubElement(node,f'{{{ns}}}priority').text='0.7'
        count+=1
ET.indent(tree,space='    ')
tree.write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
print(f'Connected language paths; added {count} sitemap URLs')
