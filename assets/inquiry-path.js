// Only page paths and funnel stages enter analytics; never names, emails or messages.
(() => {
  const form = document.getElementById('inquiryForm');
  const trigger = document.getElementById('quickInquiryBtn');
  if (!form || !trigger) return;
  const language = document.documentElement.lang;
  const candidate = new URLSearchParams(location.search).get('from') || '';
  const source = /^\/(?:es\/|pt-br\/|ar\/)?(?:articles|products)\/[a-z0-9-]+\.html$/.test(candidate) || /^\/(?:es|pt-br|ar)\/contact\.html$/.test(candidate) ? candidate : location.pathname;
  const hidden = document.createElement('input');
  hidden.type = 'hidden'; hidden.name = 'source_page'; hidden.value = source;
  form.append(hidden);
  const emit = stage => {
    if (typeof window.gtag === 'function') window.gtag('event', 'inquiry_' + stage, {source_page: source, content_language: language});
  };
  trigger.addEventListener('click', () => emit('open'));
  let started = false;
  form.addEventListener('input', event => {
    if (!started && event.target.name !== '_honey') { started = true; emit('start'); }
  });
  form.addEventListener('submit', () => emit('submit_attempt'));
  const error = document.getElementById('formError');
  if (error) new MutationObserver(() => {
    if (error.classList.contains('is-active')) emit('error');
  }).observe(error, {attributes: true, attributeFilter: ['class']});
  if (new URLSearchParams(location.search).get('inquiry') === '1') {
    trigger.click();
    form.querySelector('input[required]')?.focus();
  }
})();
