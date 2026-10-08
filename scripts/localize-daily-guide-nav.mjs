export const navLabels = {
  en: { languages: 'Language versions', related: 'Related buyer guides' },
  es: { languages: 'Versiones de idioma', related: 'Guías relacionadas para compradores' },
  'pt-br': { languages: 'Versões de idioma', related: 'Guias relacionados para compradores' },
  ar: { languages: 'نسخ اللغات', related: 'أدلة شراء ذات صلة' },
};

export function localizeDailyGuideNav(source, locale) {
  const labels = navLabels[locale];
  if (!labels) throw new Error(`Unsupported daily-guide locale: ${locale}`);
  return source
    .replace('aria-label="Language versions"', `aria-label="${labels.languages}"`)
    .replace('aria-label="Related buyer guides"', `aria-label="${labels.related}"`);
}
