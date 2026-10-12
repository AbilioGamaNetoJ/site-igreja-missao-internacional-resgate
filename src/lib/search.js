// Regra da busca do blog, a mesma na listagem (/blog?search=, no servidor) e nas
// sugestões que aparecem enquanto a pessoa digita (no navegador): assim as duas
// nunca discordam sobre o que foi encontrado.
import { translationsByLang, categoryName } from './supabase.js';

// Minúsculas e sem acento: "Oração" e "oracao" encontram o mesmo post.
export const normalise = (value = '', locale) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase(locale);

// Cada palavra da busca precisa aparecer em algum lugar do post, em qualquer ordem.
export const searchTerms = (query, locale) => normalise(query, locale).split(/\s+/).filter(Boolean);
export const matchesTerms = (text, terms) => terms.every((term) => text.includes(term));

// Onde a busca procura, já normalizado: título, resumo, passagem bíblica, categoria e autor.
// O corpo fica de fora para o índice das sugestões continuar leve na página.
export const postSearchText = (post, lang, locale) => {
  const translation = translationsByLang(post)[lang];
  return normalise(
    [translation?.title, translation?.excerpt, translation?.bible_reference, categoryName(post, lang), post.author]
      .filter(Boolean)
      .join(' '),
    locale,
  );
};
