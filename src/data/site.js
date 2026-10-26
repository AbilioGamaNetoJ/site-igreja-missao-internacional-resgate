// Dados fixos da igreja, compartilhados por todas as páginas e idiomas.
// Itens marcados com PROVISÓRIO aguardam o conteúdo oficial.

const address = 'Rua Vereador Manoel Mariano, 2014, Forquilhinhas, São José, SC';

export const site = {
  name: 'Missão Internacional Resgate',
  // Domínio do site, com https:// e sem barra no final. Usado no canonical, hreflang, Open Graph e sitemap.xml.
  // Vazio, essas tags ficam de fora.
  url: 'https://missaointernacionalresgate.com.br',
  phone: { display: '(48) 98831-3964', href: 'tel:+5548988313964', international: '+55 48 98831-3964' },
  whatsapp: 'https://wa.me/5548988313964',
  address: {
    street: 'Rua Vereador Manoel Mariano, 2014',
    city: 'Forquilhinhas · São José · SC',
    // Partes separadas para os dados estruturados (schema.org) e o llms.txt.
    neighborhood: 'Forquilhinhas',
    locality: 'São José',
    region: 'SC',
    // PROVISÓRIO: CEP da faixa de números acima de 981 da rua (nome oficial: Rua Vereador Arthur Manoel Mariano). Confirmar nos Correios.
    postalCode: '88106-501',
    country: 'BR',
  },
  // Lugares que a igreja atende, do mais próximo ao mais amplo. Vão para os dados estruturados.
  // Sempre com a cidade junto: Forquilhinha também é o nome de um município no sul de SC.
  areaServed: ['Forquilhinhas, São José, SC', 'São José, SC', 'Grande Florianópolis, SC'],
  // Horários em formato de máquina, para os dados estruturados. Ao mudar um horário, atualize também "times" em src/i18n/content.js.
  schedule: [
    { day: 'Friday', opens: '20:00', closes: '21:30' },
    { day: 'Saturday', opens: '16:00', closes: '18:00' },
    { day: 'Sunday', opens: '10:00', closes: '12:00' },
  ],
  // Idioma dos cultos (BCP 47).
  serviceLanguage: 'es',
  // PROVISÓRIO: o mapa usa a busca pelo endereço. Troque pelo link oficial do Google Maps quando houver.
  map: {
    embed: `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
    link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  },
  // PROVISÓRIO: preencher com o e-mail oficial. Enquanto estiver vazio, ele não aparece no site.
  email: '',
  // PROVISÓRIO: preencher com os links oficiais. Enquanto estiverem vazios, os ícones apontam para "#".
  social: [
    { name: 'Instagram', icon: 'instagram', href: '' },
    { name: 'Facebook', icon: 'facebook', href: '' },
    { name: 'YouTube', icon: 'youtube', href: '' },
  ],
  logo: { src: '/logos/logo-horizontal-320.webp', width: 320, height: 185 },
  symbol: { src: '/logos/logo-simbolo-160.webp', width: 160, height: 216 },
  // Imagem que aparece ao compartilhar o link (WhatsApp, Facebook) e nos resultados de busca.
  // É um print da home. Ao mudar o topo da home, tire o print de novo.
  shareImage: { src: '/og-image.webp', width: 4800, height: 2520 },
};

// Link do WhatsApp com a mensagem padrão já escrita. O texto de cada idioma fica em ui.whatsappMessage, em src/i18n/content.js.
export const whatsappLink = (message) => `${site.whatsapp}?text=${encodeURIComponent(message)}`;
