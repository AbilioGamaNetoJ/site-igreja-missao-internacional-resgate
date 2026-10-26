// Informações para buscadores e assistentes de IA: endereços completos e o JSON-LD (schema.org) de cada página.
// Usa os defaults locais como fallback; layouts passam os dados publicados do CMS quando disponíveis.
import { site } from './site.js';
import { photos } from './photos.js';
import { content } from '../i18n/content.js';
import { languages, pathFor } from '../i18n/routes.js';

// Com o domínio definido, devolve o endereço completo. Sem ele, devolve o caminho relativo.
export const absoluteUrl = (path, base) => (base ? new URL(path, base).href : path);

// Endereço em uma linha, no formato usado no Brasil.
export const fullAddress = (siteData = site) => {
  const { street, neighborhood, locality, region, postalCode } = siteData.address;
  return `${street} - ${neighborhood}, ${locality} - ${region}, ${postalCode}, Brasil`;
};

const pageTypes = { church: 'AboutPage', visit: 'FAQPage' };

export function structuredData({ lang, page, title, base, contentData, siteData = site, mediaPhotos = {} }) {
  const t = contentData ?? content[lang];
  const url = (path) => absoluteUrl(path, base);
  const homeUrl = url('/');
  const pageUrl = url(pathFor(page, lang));
  const churchId = `${homeUrl}#igreja`;
  const websiteId = `${homeUrl}#site`;
  const sameAs = siteData.social.map((network) => network.href).filter(Boolean);

  // A igreja é ao mesmo tempo um lugar (Church) e uma organização, o que libera campos como logo e idiomas.
  const church = {
    '@type': ['Church', 'Organization'],
    '@id': churchId,
    name: siteData.name,
    description: t.meta.descriptions.home,
    url: homeUrl,
    logo: { '@type': 'ImageObject', url: url(siteData.symbol.src), width: siteData.symbol.width, height: siteData.symbol.height },
    image: [mediaPhotos.facade || photos.facade, mediaPhotos.hall || photos.hall, mediaPhotos.congregation || photos.congregation].map(url),
    telephone: siteData.phone.international,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${siteData.address.street} - ${siteData.address.neighborhood}`,
      addressLocality: siteData.address.locality,
      addressRegion: siteData.address.region,
      postalCode: siteData.address.postalCode,
      addressCountry: siteData.address.country,
    },
    hasMap: siteData.map.link,
    areaServed: siteData.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsLanguage: [siteData.serviceLanguage, 'pt-BR'],
    openingHoursSpecification: siteData.schedule.map(({ day, opens, closes }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${day}`,
      opens,
      closes,
    })),
    isAccessibleForFree: true,
    publicAccess: true,
    ...(sameAs.length && { sameAs }),
  };

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: homeUrl,
    name: siteData.name,
    inLanguage: Object.values(languages).map((language) => language.htmlLang),
    publisher: { '@id': churchId },
  };

  const webpage = {
    '@type': pageTypes[page] ?? 'WebPage',
    '@id': `${pageUrl}#pagina`,
    url: pageUrl,
    name: title,
    description: t.meta.descriptions[page],
    inLanguage: languages[lang].htmlLang,
    isPartOf: { '@id': websiteId },
    about: { '@id': churchId },
  };

  if (page !== 'home') {
    webpage.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.nav.home, item: url(pathFor('home', lang)) },
        { '@type': 'ListItem', position: 2, name: t.nav[page], item: pageUrl },
      ],
    };
  }

  if (page === 'visit') {
    webpage.mainEntity = t.visit.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    }));
  }

  // "<" escapado para o JSON nunca fechar a tag <script> antes da hora.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [church, website, webpage] }).replace(/</g, '\\u003c');
}
