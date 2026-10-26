// Gera /sitemap.xml com todas as páginas nos três idiomas, agora sob demanda:
// além das páginas institucionais nos três idiomas, lista o blog e cada post publicado
// (um post novo entra no sitemap na hora, sem novo deploy).
// Cada endereço lista as suas traduções (hreflang), já que os caminhos mudam de idioma para idioma.
// Precisa do domínio: sem site.url em src/data/site.js, o arquivo não é gerado.
import { defaultLang, languages, pageIds, pathFor, blogPath } from '../i18n/routes.js';
import { fetchPublishedPosts } from '../lib/supabase.js';

export const prerender = false;

const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET({ site: base }) {
  if (!base) return new Response(null, { status: 404 });

  // Um cluster hreflang: o mesmo conteúdo nos três idiomas + x-default no português.
  // paths leva cada código de idioma ao endereço daquela versão.
  const urlEntry = (lang, paths) => {
    const href = (code) => new URL(paths[code], base).href;
    const alternates = [
      ...Object.entries(languages).map(([code, language]) => [language.htmlLang, href(code)]),
      ['x-default', href(defaultLang)],
    ];
    return [
      '  <url>',
      `    <loc>${escapeXml(href(lang))}</loc>`,
      ...alternates.map(([hreflang, link]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(link)}" />`),
      '  </url>',
    ].join('\n');
  };

  const langPaths = (pathForLang) => Object.fromEntries(Object.keys(languages).map((code) => [code, pathForLang(code)]));

  const entries = [
    // Páginas institucionais.
    ...pageIds.flatMap((page) => Object.keys(languages).map((lang) => urlEntry(lang, langPaths((code) => pathFor(page, code))))),
    // Listagem do blog.
    ...Object.keys(languages).map((lang) => urlEntry(lang, langPaths((code) => blogPath(code)))),
    // Posts publicados (o slug é igual nos três idiomas; só o prefixo muda).
    ...(await fetchPublishedPosts()).flatMap((post) =>
      Object.keys(languages).map((lang) => urlEntry(lang, langPaths((code) => blogPath(code, post.slug)))),
    ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
  ].join('\n');

  return new Response(`${xml}\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
