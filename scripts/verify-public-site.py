"""Read-only whole-site verification. Writes evidence outside the deployed repository."""
import concurrent.futures as cf
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import urllib.parse as url
import urllib.request as req
import urllib.error
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://luvieindustry.com'
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.links = []; self.assets = []; self.alternates = {}; self.canonical = None
        self.ids = set(); self.lang = ''; self.h1 = 0; self.meta = {}; self.text = []; self.skip = 0
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style'): self.skip += 1
        if 'id' in a: self.ids.add(a['id'])
        if tag == 'html': self.lang = a.get('lang', '')
        if tag == 'h1': self.h1 += 1
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag in ('img', 'script', 'video', 'source') and a.get('src'): self.assets.append(a['src'])
        if tag == 'video' and a.get('poster'): self.assets.append(a['poster'])
        if tag == 'link':
            if a.get('rel') == 'stylesheet': self.assets.append(a.get('href', ''))
            if a.get('rel') == 'canonical': self.canonical = a.get('href')
            if a.get('rel') == 'alternate' and 'hreflang' in a: self.alternates[a['hreflang']] = a.get('href')
        if tag == 'meta': self.meta[a.get('name', a.get('property', ''))] = a.get('content', '')
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
    def handle_data(self, data):
        if not self.skip: self.text.append(data)

def disk(route):
    p = url.unquote(url.urlsplit(route).path)
    return ROOT / (p.lstrip('/') + ('index.html' if p.endswith('/') else ''))

sm = ET.parse(ROOT/'sitemap.xml')
urls = [e.text for e in sm.iter() if e.tag.endswith('}loc') or e.tag == 'loc']
pages = {}; issues = []; targets = set(urls); external = set(); fragments = []
for address in urls:
    file = disk(address)
    if not file.exists(): issues.append({'type': 'missing_sitemap_file', 'page': address}); continue
    if file.suffix != '.html': continue
    source = file.read_text(); page = Page(source); pages[address] = page
    if page.canonical != address: issues.append({'type': 'canonical', 'page': address, 'value': page.canonical})
    if page.h1 != 1: issues.append({'type': 'h1_count', 'page': address, 'value': page.h1})
    if not page.lang: issues.append({'type': 'missing_lang', 'page': address})
    if 'noindex' in page.meta.get('robots', ''): issues.append({'type': 'noindex_in_sitemap', 'page': address})
    if re.search(r'[\u3400-\u9fff]', ''.join(page.text)): issues.append({'type': 'visible_chinese', 'page': address})
    for raw in page.links + page.assets + list(page.alternates.values()):
        absolute = url.urljoin(address, raw); parsed = url.urlsplit(absolute)
        if parsed.scheme not in ('http', 'https'): continue
        if parsed.hostname not in ('luvieindustry.com', 'www.luvieindustry.com'):
            if raw in page.links: external.add(absolute)
            continue
        clean = url.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, '', ''))
        targets.add(clean)
        if not disk(clean).exists(): issues.append({'type': 'missing_local_target', 'page': address, 'target': raw})
        if parsed.fragment: fragments.append((address, clean, url.unquote(parsed.fragment)))
for source, target, fragment in fragments:
    if fragment and target in pages and fragment not in pages[target].ids:
        issues.append({'type': 'missing_anchor', 'page': source, 'target': target+'#'+fragment})
for address, page in pages.items():
    for lang, target in page.alternates.items():
        if target in pages and address not in pages[target].alternates.values():
            issues.append({'type': 'nonreciprocal_hreflang', 'page': address, 'target': target})
missing_translations = []
for file in sorted((ROOT/'articles').glob('*.html')):
    if file.name == 'index.html': continue
    translated = Page(file.read_text()).alternates
    for locale in ('es', 'pt-br', 'ar'):
        alternate = translated.get('pt-BR' if locale == 'pt-br' else locale)
        if alternate and disk(alternate).exists(): continue
        if not (ROOT/locale/'articles'/file.name).exists(): missing_translations.append('/'+locale+'/articles/'+file.name)
missing_products = ['/'+l+'/products/'+f.name for f in (ROOT/'products').glob('*.html') for l in ('es','pt-br','ar') if not (ROOT/l/'products'/f.name).exists()]

def check(address):
    address = url.quote(address, safe=':/%?=&#+')
    last_error = None
    for attempt in range(3):
        result = check_once(address)
        if result['status'] != 0: return result
        last_error = result
    return last_error

def check_once(address):
    try:
        with req.urlopen(req.Request(address, headers={'User-Agent':'Luvie-Site-Verification/1.0'}, method='GET'), timeout=20) as response:
            sample = response.read(256)
            return {'url':address, 'status':response.status, 'final_url':response.url, 'type':response.headers.get('Content-Type',''), 'pdf_signature':sample.startswith(b'%PDF') if url.urlsplit(address).path.endswith('.pdf') else None}
    except urllib.error.HTTPError as exc: return {'url':address, 'status':exc.code}
    except Exception as exc: return {'url':address, 'status':0, 'error':str(exc)}

targets.update([BASE+'/robots.txt', BASE+'/sitemap.xml', 'http://luvieindustry.com/', 'https://www.luvieindustry.com/'])
print(f'Checking {len(urls)} sitemap URLs and {len(targets)} unique internal page/asset URLs', flush=True)
results = []
with cf.ThreadPoolExecutor(max_workers=8) as pool:
    for result in pool.map(check, sorted(targets)):
        results.append(result)
        if result['status'] != 200: print('HTTP', result, flush=True)
report = {'sitemap_count':len(urls), 'duplicate_sitemap_urls':[u for u,n in Counter(urls).items() if n>1], 'html_count':len(pages), 'http_count':len(results), 'http_failures':[r for r in results if r['status'] != 200 or r.get('pdf_signature') is False], 'issues':issues, 'missing_article_translations':missing_translations, 'missing_product_translations':missing_products, 'external_links':sorted(external), 'http_results':results}
(OUT/'site-verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps({k:v for k,v in report.items() if k not in ('http_results','external_links','issues','missing_article_translations','missing_product_translations')}, ensure_ascii=False, indent=2))
print('Issue types:', dict(Counter(i['type'] for i in issues)), 'Missing article translations:', len(missing_translations), 'Missing product translations:', len(missing_products), flush=True)
