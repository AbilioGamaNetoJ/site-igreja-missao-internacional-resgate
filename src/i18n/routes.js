// Idiomas e endereços de cada página. O português fica na raiz (/),
// espanhol em /es e inglês em /en, cada um com o endereço traduzido.

// ogLocale é o formato que o Open Graph (WhatsApp, Facebook) espera.
export const languages = {
  pt: { label: 'PT', name: 'Português', flag: '🇧🇷', htmlLang: 'pt-BR', ogLocale: 'pt_BR' },
  es: { label: 'ES', name: 'Español', flag: '🇪🇸', htmlLang: 'es', ogLocale: 'es_LA' },
  en: { label: 'EN', name: 'English', flag: '🇺🇸', htmlLang: 'en', ogLocale: 'en_US' },
};

export const defaultLang = 'pt';

const slugs = {
  home: { pt: '', es: '', en: '' },
  church: { pt: 'a-igreja', es: 'la-iglesia', en: 'the-church' },
  gatherings: { pt: 'encontros', es: 'encuentros', en: 'gatherings' },
  outreach: { pt: 'acoes', es: 'acciones', en: 'outreach' },
  visit: { pt: 'visite', es: 'visitanos', en: 'visit' },
  // O blog tem o mesmo endereço nos três idiomas; o slug de cada post também é único
  // e igual nas três línguas, para o link de um post nunca mudar.
  blog: { pt: 'blog', es: 'blog', en: 'blog' },
};

// Páginas institucionais, pré-renderizadas em [...path].astro (o blog fica de fora:
// é sob demanda, em src/pages/blog e src/pages/[lang]/blog).
export const pageIds = ['home', 'church', 'gatherings', 'outreach', 'visit'];

// Páginas que aparecem no menu, na ordem.
export const navPages = ['home', 'church', 'gatherings', 'outreach', 'visit', 'blog'];

export const pathFor = (page, lang) => {
  const segments = [lang === defaultLang ? '' : lang, slugs[page][lang]].filter(Boolean);
  return `/${segments.join('/')}`;
};

// Endereço de um post: a listagem é blogPath(lang) e o artigo é blogPath(lang, slug).
export const blogPath = (lang, slug) => pathFor('blog', lang) + (slug ? `/${slug}` : '');
