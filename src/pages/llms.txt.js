// Gera /llms.txt (llmstxt.org): um resumo em Markdown que assistentes de IA leem
// para responder sobre a igreja (o que é, onde fica, horários, idioma e contato).
// Os textos publicados saem do CMS, com src/data/site.js e src/i18n/content.js como fallback.
import { absoluteUrl, fullAddress } from '../data/seo.js';
import { defaultLang, languages, navPages, pageIds, pathFor, blogPath } from '../i18n/routes.js';
import { getAllPageData } from '../lib/site-cms.js';

export const prerender = false;

const sectionTitles = { pt: 'Páginas', es: 'Español', en: 'English' };

export async function GET({ site: base }) {
  const languageData = await Promise.all(Object.keys(languages).map((lang) => getAllPageData(lang)));
  const dataByLang = Object.fromEntries(Object.keys(languages).map((lang, index) => [lang, languageData[index]]));
  const defaultData = dataByLang[defaultLang];
  const t = defaultData.home.content;
  const siteData = defaultData.home.site;
  const pageIdsForList = [...new Set([...navPages, ...pageIds.filter((page) => !navPages.includes(page))])];
  const pageList = (lang) =>
    pageIdsForList.map((page) => {
      const pageData = dataByLang[lang][page].content;
      const label = page === 'privacy' ? pageData.footer.privacy : pageData.nav[page];
      const path = page === 'blog' ? blogPath(lang) : pathFor(page, lang);
      return `- [${label}](${absoluteUrl(path, base)}): ${pageData.meta.descriptions[page]}`;
    });

  const lines = [
    `# ${siteData.name}`,
    '',
    `> ${t.meta.descriptions.home}`,
    '',
    `- Endereço: ${fullAddress(siteData)}`,
    `- Bairro e cidade: ${siteData.address.neighborhood}, ${siteData.address.locality} (${siteData.address.region}), na Grande Florianópolis`,
    `- Horários dos cultos: ${t.times.map((time) => `${time.day}, ${time.hour}`).join('; ')}`,
    '- Idioma dos cultos: espanhol. Pessoas que falam português e outros idiomas também são bem-vindas.',
    `- Telefone e WhatsApp: ${siteData.phone.display} (${siteData.whatsapp})`,
    `- Mapa: ${siteData.map.link}`,
    ...(siteData.email ? [`- E-mail: ${siteData.email}`] : []),
    ...siteData.social.filter((network) => network.href).map((network) => `- ${network.name}: ${network.href}`),
    '',
    `## ${sectionTitles.pt}`,
    '',
    ...pageList('pt'),
    '',
    '## Perguntas frequentes',
    '',
    ...defaultData.visit.content.visit.faq.map(({ q, a }) => `- **${q}** ${a}`),
    ...Object.keys(languages)
      .filter((lang) => lang !== defaultLang)
      .flatMap((lang) => ['', `## ${sectionTitles[lang]}`, '', `${dataByLang[lang].home.content.meta.descriptions.home}`, '', ...pageList(lang)]),
  ];

  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
