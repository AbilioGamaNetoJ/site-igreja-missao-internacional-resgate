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
};

export const pageIds = Object.keys(slugs);

// Páginas que aparecem no menu, na ordem.
export const navPages = ['home', 'church', 'gatherings', 'outreach', 'visit'];

export const pathFor = (page, lang) => {
  const segments = [lang === defaultLang ? '' : lang, slugs[page][lang]].filter(Boolean);
  return `/${segments.join('/')}`;
};
