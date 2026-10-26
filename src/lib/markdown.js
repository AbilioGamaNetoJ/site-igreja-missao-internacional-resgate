// Renderização do corpo do post: Markdown em, HTML controlado out.
// Quem escreve são admins, mas o corpo é tratado como texto: qualquer < vira
// entidade antes de interpretar o Markdown, então HTML cru nunca é executado.
import { marked } from 'marked';

export function renderMarkdown(markdown) {
  const html = !markdown ? '' : marked.parse(markdown.replace(/</g, '&lt;'), { async: false, gfm: true, breaks: false });
  // Markdown não permite HTML cru, e links de protocolos ativos também são recusados.
  return html.replace(/\b(href|src)="([^"]*)"/gi, (attribute, name, value) =>
    /^(https?:\/\/|mailto:|tel:|#)/i.test(value) || (value.startsWith('/') && !value.startsWith('//'))
      ? attribute
      : `${name}="#"`,
  );
}
