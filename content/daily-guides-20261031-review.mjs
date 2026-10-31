// Full-paragraph editorial overrides are added after inspecting translated copy.
export function reviewTranslations(guides) {
  for (const guide of guides) for (const locale of ['es','pt-br','ar']) {
    guide[locale].title = guide[locale].title.replace(/\s*\|[^|]*$/, ' | Luvie');
  }
}
