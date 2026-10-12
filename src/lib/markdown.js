// Renderização do corpo do post: Markdown em, HTML controlado out.
// Quem escreve são admins, mas o corpo é tratado como texto: qualquer < vira
// entidade antes de interpretar o Markdown, então HTML cru nunca é executado.
import { marked } from 'marked';

export function renderMarkdown(markdown) {
  const html = !markdown ? '' : marked.parse(markdown.replace(/</g, '&lt;'), { async: false, gfm: true, breaks: false });
  // #region agent log
  fetch('http://127.0.0.1:7869/ingest/67c70e97-e7d0-437b-af9e-a01638eec5aa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'67da8c'},body:JSON.stringify({sessionId:'67da8c',runId:'post-fix',hypothesisId:'B',location:'markdown.js:renderMarkdown',message:'rendered body',data:{inputLen:typeof markdown==='string'?markdown.length:0,htmlLen:html.length,hasHeading:html.includes('<h2'),hasImage:html.includes('<img')},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return html;
}
