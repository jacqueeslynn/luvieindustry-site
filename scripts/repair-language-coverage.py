"""Repair the corrupted Spanish cache and generate only missing translations.

Preserves reviewed existing pages. Run with a locally installed trn executable.
Generated translations must pass content and navigation review before release.
"""
import argparse
import importlib.util
import json
import subprocess
from pathlib import Path
from bs4 import BeautifulSoup, Comment, Doctype

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('archive', ROOT/'scripts/localize-article-archive.py')
archive = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archive)

def replace_values(soup, replacements):
    for node in list(soup.find_all(string=True)):
        if isinstance(node, (Comment, Doctype)) or node.parent.name in ('script','style'):
            continue
        original = str(node)
        if original.strip() in replacements:
            node.replace_with(original.replace(original.strip(), replacements[original.strip()], 1))
    for tag in soup.find_all(True):
        for attribute in ('alt','title','aria-label','placeholder','content'):
            value = tag.get(attribute)
            if isinstance(value,str) and value in replacements: tag[attribute] = replacements[value]
    def walk(value):
        if isinstance(value,str): return replacements.get(value,value)
        if isinstance(value,list): return [walk(v) for v in value]
        if isinstance(value,dict): return {k:walk(v) for k,v in value.items()}
        return value
    for tag in soup.find_all('script',type='application/ld+json'):
        if tag.string:
            tag.string = json.dumps(walk(json.loads(tag.string)),ensure_ascii=False,separators=(',',':'))

def repair_spanish(command):
    path, cache = archive.translation_cache('es')
    # The first committed cache already contained the destructive global or->o
    # replacement. Re-translate only entries not subsequently reviewed/changed.
    original = json.loads(subprocess.check_output(['git','show','642f18c:content/translations/es.json'],cwd=ROOT,text=True))
    selected = {key for key,value in original.items() if cache.get(key) == value and key not in archive.TRANSLATION_OVERRIDES['es']}
    repair_path = ROOT/'content/translations/es-recovery.json'
    fresh = json.loads(repair_path.read_text()) if repair_path.exists() else {}
    archive.translate_missing('es', selected, fresh, repair_path, command, None, 4, 'low')
    replacements = {cache[k]:fresh[k] for k in selected if cache[k] != fresh[k]}
    for page in (ROOT/'es').rglob('*.html'):
        html = page.read_text()
        soup = BeautifulSoup(html,'html.parser')
        replace_values(soup,replacements)
        revised = str(soup).rstrip()+'\n'
        if revised != html: page.write_text(revised)
    cache.update({key:fresh[key] for key in selected})
    archive.save_cache(path,cache)
    print(f'Recovered {len(replacements)} Spanish strings without replacing reviewed cache entries',flush=True)

def fill_missing(command):
    for locale in archive.LANGS:
        pages = [p for p in archive.source_pages() if not archive.translated_path(locale,p).exists()]
        if not pages: continue
        values = set().union(*(archive.text_candidates(BeautifulSoup(p.read_text(),'html.parser')) for p in pages))
        path,cache = archive.translation_cache(locale)
        cache.update(archive.TRANSLATION_OVERRIDES[locale])
        archive.translate_missing(locale,values,cache,path,command,None,4,'low')
        for page in pages: archive.process_page(page,locale,cache)
        print(f'{locale}: generated {len(pages)} missing pages',flush=True)

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--translator',required=True)
    parser.add_argument('--stage',choices=['spanish','missing'],required=True)
    args=parser.parse_args()
    (repair_spanish if args.stage=='spanish' else fill_missing)(args.translator)
