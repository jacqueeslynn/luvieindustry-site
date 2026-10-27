const copy = {
  en: ['Discuss your order', 'Tell us the destination, product and approximate quantity. Not sure of the model? Send a catalog reference. We can discuss available specifications and quotation requirements.', 'Request a quote by email', 'Discuss on WhatsApp', 'Hello Luvie, I am interested in this guide:', 'Destination:\nProduct or catalog reference:\nApproximate quantity (or not sure):'],
  es: ['Consulte su pedido', 'Indique destino, producto y cantidad aproximada. Si no conoce el modelo, envíe una referencia del catálogo. Podemos revisar especificaciones disponibles y datos para cotizar.', 'Solicitar cotización por correo', 'Consultar por WhatsApp', 'Hola Luvie, me interesa esta guía:', 'Destino:\nProducto o referencia del catálogo:\nCantidad aproximada (o por definir):'],
  'pt-br': ['Converse sobre seu pedido', 'Informe destino, produto e quantidade aproximada. Não sabe o modelo? Envie uma referência do catálogo. Podemos conversar sobre especificações disponíveis e dados para cotação.', 'Pedir cotação por e-mail', 'Conversar no WhatsApp', 'Olá Luvie, tenho interesse neste guia:', 'Destino:\nProduto ou referência do catálogo:\nQuantidade aproximada (ou a definir):'],
  ar: ['ناقش طلبك', 'اذكر الوجهة والمنتج والكمية التقريبية. إذا لم تعرف الموديل فأرسل مرجعاً من الكتالوج. يمكننا مناقشة المواصفات المتاحة ومتطلبات عرض السعر.', 'اطلب عرضاً بالبريد الإلكتروني', 'استفسر عبر واتساب', 'مرحباً Luvie، أهتم بهذا الدليل:', 'الوجهة:\nالمنتج أو مرجع الكتالوج:\nالكمية التقريبية أو غير محددة:'],
};
export function enhanceGuideConversion(html, locale, heading, url) {
  const [title, intro, email, whatsapp, greeting, fields] = copy[locale];
  const body = encodeURIComponent(`${greeting}\n${heading}\n${url}\n\n${fields}`);
  const mail = `mailto:jinsburg@luvieindustry.com?subject=${encodeURIComponent(heading)}&amp;body=${body}`;
  const wa = `https://wa.me/306947135317?text=${body}`;
  const card = `<aside class="answer inquiry-options"><strong>${title}</strong><p>${intro}</p><p><a data-contact-method="email" href="${mail}">${email}</a></p><p><a data-contact-method="whatsapp" href="${wa}">${whatsapp}</a></p></aside>`;
  return html.replace(/<div class="cta">[\s\S]*?<\/div>/, card)
    .replace(/<a class="contact" href="https:\/\/wa.me\/306947135317">[^<]*<\/a>/, `<a class="contact" data-contact-method="whatsapp" href="${wa}">${whatsapp}</a>`)
    .replace('</body>', '<script src="/assets/guide-conversion.js" defer></script></body>');
}
