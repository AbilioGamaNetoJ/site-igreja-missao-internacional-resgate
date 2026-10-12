// Renderização do corpo do post: Markdown em, HTML controlado out.
// Quem escreve são admins, mas o corpo é tratado como texto: qualquer < vira
// entidade antes de interpretar o Markdown, então HTML cru nunca é executado.
import { marked } from 'marked';

export function renderMarkdown(markdown) {
  if (!markdown) return '';
  const inert = markdown.replace(/</g, '&lt;');
  return marked.parse(inert, { async: false, gfm: true, breaks: false });
}
