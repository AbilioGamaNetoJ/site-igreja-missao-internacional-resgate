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
  'id,slug,cover_image,category,category_info:categories(name_pt,name_es,name_en),author,is_featured,is_primary,published_at,source_lang,post_translations(lang,title,excerpt,body,bible_reference,seo_title,seo_description,is_original,manually_edited,updated_at)';

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
  const ready = isPostReady(post) ? post : null;
  // #region agent log
  const translations = ready?.post_translations ?? [];
  fetch('http://127.0.0.1:7869/ingest/67c70e97-e7d0-437b-af9e-a01638eec5aa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'67da8c'},body:JSON.stringify({sessionId:'67da8c',runId:'post-fix',hypothesisId:'A',location:'supabase.js:fetchPostBySlug',message:'post body fields',data:{slug,rowCount:Array.isArray(rows)?rows.length:0,ready:Boolean(ready),langs:translations.map((item)=>({lang:item.lang,bodyLen:typeof item.body==='string'?item.body.length:0,excerptLen:typeof item.excerpt==='string'?item.excerpt.length:0,hasImage:typeof item.body==='string'&&item.body.includes('!['),newlines:typeof item.body==='string'?item.body.split('\n').length-1:0}))},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return ready;
}
