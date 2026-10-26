// Leitura pública do conteúdo publicado no CMS. Sem configuração do Supabase ou
// enquanto uma página ainda não foi publicada, o site usa os textos em content.js.
import { content as fallbackContent } from '../i18n/content.js';
import { site as fallbackSite } from '../data/site.js';
import { pageIds } from '../i18n/routes.js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const ready = Boolean(supabaseUrl && supabaseAnonKey);

const clone = (value) => structuredClone(value);

function merge(base, override) {
  if (!override || typeof override !== 'object' || Array.isArray(override)) return override ?? clone(base);
  const result = base && typeof base === 'object' && !Array.isArray(base) ? clone(base) : {};
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    result[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? merge(result[key], value)
      : clone(value);
  }
  return result;
}

function cleanRichText(value) {
  const withoutActiveContent = value.replace(/<(script|style|iframe|object|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  return withoutActiveContent.replace(/<[^>]*>/g, (tag) => {
    const match = tag.match(/^<\s*(\/?)\s*(strong|em|br)\b[^>]*>$/i);
    if (!match) return '';
    const name = match[2].toLowerCase();
    return name === 'br' ? '<br>' : `<${match[1] ? '/' : ''}${name}>`;
  });
}

function sanitizeTree(value) {
  if (typeof value === 'string') return cleanRichText(value);
  if (Array.isArray(value)) return value.map(sanitizeTree);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeTree(item)]));
}

function safeSiteSettings(value) {
  const settings = merge(fallbackSite, value ?? {});
  settings.phone = merge(fallbackSite.phone, settings.phone ?? {});
  settings.address = merge(fallbackSite.address, settings.address ?? {});
  settings.map = merge(fallbackSite.map, settings.map ?? {});
  settings.logo = merge(fallbackSite.logo, settings.logo ?? {});
  settings.symbol = merge(fallbackSite.symbol, settings.symbol ?? {});
  settings.shareImage = merge(fallbackSite.shareImage, settings.shareImage ?? {});
  const safeLink = (candidate, fallback = '') => {
    if (typeof candidate !== 'string' || !candidate.trim()) return fallback;
    const link = candidate.trim();
    if (/^(https?:\/\/|tel:|mailto:|#)/i.test(link) || (link.startsWith('/') && !link.startsWith('//'))) return link;
    return fallback;
  };

  settings.phone.href = safeLink(settings.phone?.href, fallbackSite.phone.href);
  settings.phone.display = typeof settings.phone.display === 'string' ? settings.phone.display : fallbackSite.phone.display;
  settings.phone.international = typeof settings.phone.international === 'string' ? settings.phone.international : fallbackSite.phone.international;
  settings.whatsapp = /^https:\/\//i.test(settings.whatsapp ?? '') ? settings.whatsapp : fallbackSite.whatsapp;
  settings.map.link = safeLink(settings.map?.link, fallbackSite.map.link);
  settings.map.embed = safeLink(settings.map?.embed, fallbackSite.map.embed);
  settings.logo.src = safeLink(settings.logo.src, fallbackSite.logo.src);
  settings.symbol.src = safeLink(settings.symbol.src, fallbackSite.symbol.src);
  settings.shareImage.src = safeLink(settings.shareImage.src, fallbackSite.shareImage.src);
  settings.links = Object.fromEntries(Object.entries(settings.links ?? {}).map(([key, link]) => [key, safeLink(link)]));
  settings.social = (Array.isArray(settings.social) ? settings.social : fallbackSite.social).map((item, index) => ({
    ...fallbackSite.social[index],
    ...item,
    href: safeLink(item?.href),
  }));
  return settings;
}

async function rest(path) {
  if (!ready) return null;
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: 'application/json',
      },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function pageUrl(page, lang) {
  const params = new URLSearchParams({ select: 'page,content,media', lang: `eq.${lang}`, page: `in.(${page},global)`, limit: '2' });
  return `site_pages?${params}`;
}

function assemblePageData(page, lang, cmsRows, publishedSettings) {
  const languageContent = fallbackContent[lang] ?? fallbackContent.pt;
  const pageRow = cmsRows.find((row) => row.page === page);
  const globalRow = cmsRows.find((row) => row.page === 'global');
  const globalContent = sanitizeTree(globalRow?.content ?? {});
  const pageContent = sanitizeTree(pageRow?.content ?? {});
  const globalTexts = globalContent.global ?? {};
  const seo = pageContent.__seo ?? {};
  delete pageContent.__seo;

  const text = merge(languageContent, {
    nav: globalTexts.nav,
    ui: globalTexts.ui,
    footer: globalTexts.footer,
    times: globalTexts.times,
    photos: globalTexts.photos,
    notFound: globalTexts.notFound,
    meta: {
      titles: { [page]: seo.title || languageContent.meta.titles[page] },
      descriptions: { [page]: seo.description || languageContent.meta.descriptions[page] },
      shareImageAlt: globalTexts.shareImageAlt,
    },
    [page]: pageContent,
  });

  return {
    content: text,
    site: safeSiteSettings(publishedSettings),
    media: pageRow?.media && typeof pageRow.media === 'object' ? pageRow.media : {},
    published: Boolean(pageRow),
  };
}

export async function getPageData(page, lang) {
  const [rows, settingsRows] = await Promise.all([
    rest(pageUrl(page, lang)),
    rest('site_settings?select=settings&id=eq.main&limit=1'),
  ]);
  return assemblePageData(page, lang, Array.isArray(rows) ? rows : [], Array.isArray(settingsRows) ? settingsRows[0]?.settings : null);
}

export async function getAllPageData(lang) {
  const params = new URLSearchParams({ select: 'page,content,media', lang: `eq.${lang}` });
  const [rows, settingsRows] = await Promise.all([
    rest(`site_pages?${params}`),
    rest('site_settings?select=settings&id=eq.main&limit=1'),
  ]);
  const cmsRows = Array.isArray(rows) ? rows : [];
  const settings = Array.isArray(settingsRows) ? settingsRows[0]?.settings : null;
  const ids = [...new Set([...pageIds, 'blog', 'global'])];
  return Object.fromEntries(ids.map((page) => [page, assemblePageData(page, lang, cmsRows, settings)]));
}

export async function getGlobalData(lang = 'pt') {
  return getPageData('global', lang);
}

export function publicMediaUrl(value, fallback = '') {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  const candidate = value.trim();
  return /^(https?:\/\/)/i.test(candidate) || (candidate.startsWith('/') && !candidate.startsWith('//')) ? candidate : fallback;
}

export function siteLink(settings, key, fallback) {
  const candidate = settings?.links?.[key];
  if (typeof candidate !== 'string' || !candidate.trim()) return fallback;
  return candidate;
}
