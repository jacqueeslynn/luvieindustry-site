// Contact clicks are intent signals, not confirmed leads. Never send field values.
document.addEventListener('click', function (event) {
  const link = event.target.closest?.('a[data-contact-method]');
  if (!link || typeof window.gtag !== 'function') return;
  window.gtag('event', 'guide_contact_click', {
    contact_method: link.dataset.contactMethod,
    article_path: window.location.pathname,
    content_language: document.documentElement.lang,
    transport_type: 'beacon'
  });
});
