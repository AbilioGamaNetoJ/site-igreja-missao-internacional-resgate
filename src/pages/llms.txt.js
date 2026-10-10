// Gera /llms.txt (llmstxt.org): um resumo em Markdown que assistentes de IA leem
// para responder sobre a igreja (o que é, onde fica, horários, idioma e contato).
// Os textos saem de src/data/site.js e src/i18n/content.js.
import { site } from '../data/site.js';
import { absoluteUrl, fullAddress } from '../data/seo.js';
import { content } from '../i18n/content.js';
import { defaultLang, languages, navPages, pathFor } from '../i18n/routes.js';

const sectionTitles = { pt: 'Páginas', es: 'Español', en: 'English' };

export function GET({ site: base }) {
  const t = content[defaultLang];
  const pageList = (lang) =>
    navPages.map((page) => `- [${content[lang].nav[page]}](${absoluteUrl(pathFor(page, lang), base)}): ${content[lang].meta.descriptions[page]}`);

  const lines = [
    `# ${site.name}`,
    '',
    `> ${t.meta.descriptions.home}`,
    '',
    `- Endereço: ${fullAddress()}`,
    `- Bairro e cidade: ${site.address.neighborhood}, ${site.address.locality} (${site.address.region}), na Grande Florianópolis`,
    `- Horários dos cultos: ${t.times.map((time) => `${time.day}, ${time.hour}`).join('; ')}`,
    '- Idioma dos cultos: espanhol. Pessoas que falam português e outros idiomas também são bem-vindas.',
    `- Telefone e WhatsApp: ${site.phone.display} (${site.whatsapp})`,
    `- Mapa: ${site.map.link}`,
    ...(site.email ? [`- E-mail: ${site.email}`] : []),
    ...site.social.filter((network) => network.href).map((network) => `- ${network.name}: ${network.href}`),
    '',
    `## ${sectionTitles.pt}`,
    '',
    ...pageList('pt'),
    '',
    '## Perguntas frequentes',
    '',
    ...t.visit.faq.map(({ q, a }) => `- **${q}** ${a}`),
    ...Object.keys(languages)
      .filter((lang) => lang !== defaultLang)
      .flatMap((lang) => ['', `## ${sectionTitles[lang]}`, '', `${content[lang].meta.descriptions.home}`, '', ...pageList(lang)]),
  ];

  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
