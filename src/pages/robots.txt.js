// Gera /robots.txt: o site inteiro fica liberado para buscadores e assistentes de IA.
// Content-Signal (contentsignals.org) autoriza o uso do conteúdo em buscas (search),
// em respostas geradas por IA (ai-input) e no treino de modelos (ai-train).

const contentSignal = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes';

// Robôs de IA citados pelo nome. O "User-agent: *" já libera todos eles,
// mas o grupo próprio deixa a permissão explícita para cada um.
const aiBots = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', // OpenAI (ChatGPT)
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', // Anthropic (Claude)
  'PerplexityBot', 'Perplexity-User', // Perplexity
  'Google-Extended', // Google (Gemini)
  'Applebot', 'Applebot-Extended', // Apple (Siri, Apple Intelligence)
  'meta-externalagent', // Meta AI
  'Amazonbot', // Amazon (Alexa)
  'DuckAssistBot', // DuckDuckGo
  'MistralAI-User', // Mistral (Le Chat)
  'CCBot', // Common Crawl, base de treino de vários modelos
];

export function GET({ site: base }) {
  const lines = [
    '# Missão Internacional Resgate',
    '# Buscadores e assistentes de IA podem ler todo o site.',
    '',
    'User-agent: *',
    contentSignal,
    'Allow: /',
    '',
    ...aiBots.map((bot) => `User-agent: ${bot}`),
    contentSignal,
    'Allow: /',
    '',
    '# Resumo do site para modelos de linguagem: /llms.txt',
  ];

  if (base) lines.push('', `Sitemap: ${new URL('/sitemap.xml', base).href}`);

  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
