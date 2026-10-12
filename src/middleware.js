// Roteamento por domínio do painel do blog.
//
// O site oficial responde em missaointernacionalresgate.com.br (src/data/site.js)
// e o painel do blog ganhou um subdomínio próprio: cms.missaointernacionalresgate.com.br,
// ligado ao mesmo Worker como Custom Domain no painel da Cloudflare (ver README).
//
// Aqui ficam as regras que o Worker consegue aplicar (rotas sob demanda, que
// passam por este middleware):
//   - no subdomínio cms, só o painel e o que ele usa respondem; caminhos desconhecidos
//     levam a uma 404 própria com retorno ao painel;
//   - no domínio oficial, /admin encaminha para o subdomínio.
//
// Páginas pré-renderizadas (a home, por exemplo) são servidas antes do Worker e
// não passam por aqui: para elas, o README documenta as Redirect Rules da
// Cloudflare que completam o encaminhamento.
import { site } from './data/site.js';

export const CMS_HOST = 'cms.missaointernacionalresgate.com.br';

// O que o painel carrega além de /admin: o endpoint de tradução e os arquivos
// estáticos (CSS/JS em /_astro, ícones) que a página do painel referencia.
const isPanelResource = (pathname) =>
  pathname === '/admin' ||
  pathname.startsWith('/admin/') ||
  pathname.startsWith('/api/') ||
  pathname.startsWith('/_astro/') ||
  pathname === '/favicon.png' ||
  pathname === '/apple-touch-icon.png';

export const onRequest = async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  // Sem domínio definido em src/data/site.js (dev sem site.url), nada é redirecionado.
  const mainHost = site.url ? new URL(site.url).hostname : null;

  if (url.hostname === CMS_HOST) {
    if (mainHost && !isPanelResource(url.pathname)) {
      const missingPath = new URL('/admin/not-found', url.origin);
      missingPath.searchParams.set('path', url.pathname);
      // Mantém o endereço que falhou na barra do navegador, mas renderiza a
      // página de retorno do painel com o status 404.
      return context.rewrite(missingPath);
    }
    const response = await next();
    if (url.pathname.startsWith('/admin')) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  if (mainHost && url.hostname === mainHost && url.pathname.startsWith('/admin')) {
    return context.redirect(`https://${CMS_HOST}${url.pathname}${url.search}`, 302);
  }

  return next();
};
