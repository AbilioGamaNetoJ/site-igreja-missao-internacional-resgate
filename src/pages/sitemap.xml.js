// Gera /sitemap.xml com todas as páginas nos três idiomas.
// Cada endereço lista as suas traduções (hreflang), já que os caminhos mudam de idioma para idioma.
// Precisa do domínio: sem site.url em src/data/site.js, o arquivo não é gerado.
import { defaultLang, languages, pageIds, pathFor } from '../i18n/routes.js';

export function GET({ site: base }) {
  if (!base) return new Response(null, { status: 404 });

  const href = (page, lang) => new URL(pathFor(page, lang), base).href;

  const urls = Object.keys(languages).flatMap((lang) =>
    pageIds.map((page) => {
      const alternates = [
        ...Object.entries(languages).map(([code, language]) => [language.htmlLang, href(page, code)]),
        ['x-default', href(page, defaultLang)],
      ];
      return [
        '  <url>',
        `    <loc>${href(page, lang)}</loc>`,
        ...alternates.map(([hreflang, link]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${link}" />`),
        '  </url>',
      ].join('\n');
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n');

  return new Response(`${xml}\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
