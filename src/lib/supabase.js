// Acesso de leitura ao Supabase pelo site (listagem e artigo do blog, sitemap).
// Usa a API REST (PostgREST) direto com a chave anônima: o que protege os dados
// é a RLS do banco (supabase/schema.sql) — anônimo só enxerga post publicado.
// As chaves entram no build como PUBLIC_* (seguras para o navegador por natureza).

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

// Idiomas que um post precisa ter traduzidos para ficar visível no site.
export const POST_LANGS = ['pt', 'es', 'en'];

const POST_FIELDS =
  'id,slug,cover_image,category,category_info:categories(name_pt,name_es,name_en),author,is_featured,published_at,source_lang,post_translations(lang,title,excerpt,bible_reference,seo_title,seo_description,is_original,manually_edited,updated_at)';

async function rest(path) {
  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}`, Accept: 'application/json' },
  });
  if (!response.ok) return null;
  return response.json();
}

// Traduções do post indexadas por idioma.
export const translationsByLang = (post) =>
  Object.fromEntries((post?.post_translations ?? []).map((translation) => [translation.lang, translation]));

// Nome da categoria do post no idioma da página; sem o nome naquele idioma, cai no português.
export const categoryName = (post, lang) => post?.category_info?.[`name_${lang}`] || post?.category_info?.name_pt || '';

// Um post só aparece no site quando está publicado e já tem as três traduções:
// assim o artigo nunca entra no ar em um idioma e fica vazio nos outros.
export const isPostReady = (post) => Boolean(post) && POST_LANGS.every((lang) => translationsByLang(post)[lang]?.title);

// Posts publicados, do mais recente para o mais antigo, já filtrados pelos que
// têm as três traduções. Sem Supabase configurado (ou em queda), devolve [] e a
// página mostra a mensagem de "sem publicações".
export async function fetchPublishedPosts() {
  if (!supabaseReady) return [];
  const rows = await rest(
    `/posts?select=${POST_FIELDS}&status=eq.published&order=published_at.desc`,
  );
  if (!Array.isArray(rows)) return [];
  return rows.filter(isPostReady);
}

// Até três publicações que a equipe escolheu para a vitrine da página inicial.
// A ordem é a da publicação mais recente; rascunhos nunca entram na vitrine.
export async function fetchFeaturedPosts(limit = 3) {
  if (!supabaseReady) return [];
  const rows = await rest(
    `/posts?select=${POST_FIELDS}&status=eq.published&is_featured=eq.true&order=published_at.desc&limit=${Math.min(Math.max(Number(limit) || 3, 1), 3)}`,
  );
  if (!Array.isArray(rows)) return [];
  return rows.filter(isPostReady);
}

export async function fetchPostBySlug(slug) {
  if (!supabaseReady || !slug) return null;
  const rows = await rest(
    `/posts?select=${POST_FIELDS}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
  );
  const post = Array.isArray(rows) ? rows[0] : null;
  return isPostReady(post) ? post : null;
}
