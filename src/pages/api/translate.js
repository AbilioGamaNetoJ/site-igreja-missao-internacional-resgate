// Endpoint de tradução do blog: chama a DeepL e grava as versões que faltam.
// É a única parte que roda no Worker; todo o resto do painel fala direto com o
// Supabase. A chave da DeepL (secret DEEPL_API_KEY) nunca sai daqui.
//
// POST /api/translate  Authorization: Bearer <sessão do admin no Supabase>  { postId }
//
// Regras (do plano do blog):
//   - recusa quem não está na tabela admins (a RLS devolve a própria linha só para admins);
//   - traduz do idioma original para os outros dois;
//   - nunca sobrescreve o original nem tradução marcada como editada à mão.

// Env do Worker (secrets do `wrangler secret put`; em dev, o .dev.vars via platformProxy).
import { env } from 'cloudflare:workers';

export const prerender = false;

const LANGS = ['pt', 'es', 'en'];
const TRANSLATABLE_FIELDS = ['title', 'excerpt', 'bible_reference', 'body', 'seo_title', 'seo_description'];

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Payload do JWT sem validação local: quem valida a assinatura é o Supabase —
// um token forjado não passa da RLS na consulta a admins abaixo.
function jwtSub(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).sub ?? null;
  } catch {
    return null;
  }
}

async function supabaseRest(path, token, options = {}) {
  return fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export const POST = async ({ request }) => {
  const deeplKey = env.DEEPL_API_KEY;
  if (!deeplKey) return Response.json({ error: 'Chave da DeepL não configurada no Worker.' }, { status: 503 });
  if (!supabaseUrl || !supabaseAnonKey) return Response.json({ error: 'Supabase não configurado.' }, { status: 503 });

  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return Response.json({ error: 'Sessão ausente.' }, { status: 401 });

  const sub = jwtSub(token);
  if (!sub) return Response.json({ error: 'Sessão inválida.' }, { status: 401 });

  // Só passa quem estiver na tabela admins: a política só devolve a linha do próprio usuário.
  const adminsResponse = await supabaseRest(`/admins?select=user_id&user_id=eq.${encodeURIComponent(sub)}`, token);
  if (!adminsResponse.ok || (await adminsResponse.json()).length === 0) {
    return Response.json({ error: 'Esta conta não é administradora do blog.' }, { status: 403 });
  }

  let postId;
  try {
    ({ postId } = await request.json());
  } catch {
    return Response.json({ error: 'Requisição inválida.' }, { status: 400 });
  }
  if (!postId) return Response.json({ error: 'Post não informado.' }, { status: 400 });

  const postResponse = await supabaseRest(
    `/posts?select=id,slug,source_lang,status,post_translations(*)&id=eq.${encodeURIComponent(postId)}&limit=1`,
    token,
  );
  if (!postResponse.ok) return Response.json({ error: 'Não foi possível ler o post.' }, { status: 502 });
  const post = (await postResponse.json())[0];
  if (!post) return Response.json({ error: 'Post não encontrado.' }, { status: 404 });

  const translations = post.post_translations ?? [];
  const original = translations.find((t) => t.is_original) ?? translations.find((t) => t.lang === post.source_lang);
  if (!original) return Response.json({ error: 'O post ainda não tem o texto no idioma original.' }, { status: 409 });

  const { deeplTranslate } = await import('../../lib/deepl.js');

  const translated = [];
  const skipped = [];

  for (const lang of LANGS) {
    if (lang === original.lang) continue;
    const existing = translations.find((t) => t.lang === lang);
    if (existing?.manually_edited) {
      skipped.push(lang);
      continue;
    }

    let fields;
    try {
      fields = await deeplTranslate({
        key: deeplKey,
        texts: TRANSLATABLE_FIELDS.map((field) => original[field] ?? ''),
        sourceLang: original.lang,
        targetLang: lang,
      });
    } catch (error) {
      return Response.json({ error: `Falha ao traduzir para ${lang}: ${error.message}` }, { status: 502 });
    }

    const row = { post_id: post.id, lang, manually_edited: false };
    TRANSLATABLE_FIELDS.forEach((field, index) => {
      row[field] = fields[index];
    });
    // Título é obrigatório na tabela; se a DeepL devolver vazio, herda do original.
    if (!row.title?.trim()) row.title = original.title;

    const upsertResponse = await supabaseRest('/post_translations?on_conflict=post_id,lang', token, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify([row]),
    });
    if (!upsertResponse.ok) {
      return Response.json({ error: `Não foi possível salvar a tradução em ${lang}.` }, { status: 502 });
    }
    translated.push(lang);
  }

  return Response.json({ translated, skipped, original: original.lang });
};
