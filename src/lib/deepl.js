// Tradução de posts com a DeepL. A chave fica só no Worker (secret DEEPL_API_KEY),
// nunca no navegador. O plano gratuito usa chave terminada em :fx (endpoint api-free).

// DeepL exige variante no idioma de destino: pt-BR e en-US (o espanhol não tem variante).
const TARGET_LANG = { pt: 'pt-BR', es: 'es', en: 'en-US' };
const SOURCE_LANG = { pt: 'pt', es: 'es', en: 'en' };

const endpointFor = (key) => (key.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate');

// Traduz um lote de textos de um idioma para outro. A DeepL devolve os textos na
// mesma ordem; strings vazias ficam de fora da chamada e voltam como vazias.
export async function deeplTranslate({ key, texts, sourceLang, targetLang }) {
  const entries = texts.map((text, index) => ({ text: text ?? '', index }));
  const nonEmpty = entries.filter((entry) => entry.text.trim() !== '');
  if (nonEmpty.length === 0) return texts.map(() => '');

  const response = await fetch(endpointFor(key), {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: nonEmpty.map((entry) => entry.text),
      source_lang: SOURCE_LANG[sourceLang],
      target_lang: TARGET_LANG[targetLang],
      // Mantém a formatação do Markdown (símbolos, quebras) como está.
      preserve_formatting: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepL respondeu ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  const data = await response.json();
  const result = [...texts];
  nonEmpty.forEach((entry, i) => {
    result[entry.index] = data.translations[i]?.text ?? '';
  });
  return result;
}
