// Todos os textos do site, por idioma.
// Textos marcados com PROVISÓRIO são espaços reservados até a igreja enviar o conteúdo oficial.
// Trechos entre <strong> aparecem em destaque dourado.
// Os subtítulos manuscritos (campo "script") usam a fonte Takota, que não tem travessão (— –) nem ponto médio (·).

export const content = {
  pt: {
    // Título e descrição de cada página nos buscadores. A descrição da home também descreve a igreja nos dados estruturados.
    meta: {
      titles: { home: 'Igreja evangélica em São José, SC', church: 'A Igreja em Forquilhinhas, São José', gatherings: 'Horários dos cultos em espanhol', outreach: 'Ações sociais e doação de roupas', visit: 'Endereço em Forquilhinhas, São José', blog: 'Blog' },
      descriptions: {
        home: 'Igreja evangélica no bairro Forquilhinhas, em São José (SC), de portas abertas para gente de todos os países. Cultos em espanhol às sextas, sábados e domingos.',
        church: 'Conheça a Missão Internacional Resgate, igreja evangélica em Forquilhinhas, São José (SC), formada por gente de muitos países e com cultos em espanhol.',
        gatherings: 'Cultos em espanhol em São José (SC): sextas das 20h às 21h30, sábados das 16h às 18h e domingos das 10h às 12h, no bairro Forquilhinhas.',
        outreach: 'Doação de roupas e mesa compartilhada: veja como a Missão Internacional Resgate cuida de quem chega de outros países em São José (SC).',
        visit: 'Rua Vereador Manoel Mariano, 2014, Forquilhinhas, São José (SC). Veja o mapa, os horários dos cultos em espanhol e fale com a gente pelo WhatsApp.',
        blog: 'Mensagens, novidades e reflexões da Missão Internacional Resgate, igreja evangélica em Forquilhinhas, São José (SC).',
      },
      // Texto alternativo da imagem de compartilhamento (images/og-image.webp, um print da home).
      shareImageAlt: 'Página inicial do site da Missão Internacional Resgate: "Uma casa para quem veio de longe.", com os horários dos cultos',
    },
    nav: { home: 'Início', church: 'A Igreja', gatherings: 'Encontros', outreach: 'Ações', visit: 'Visite', blog: 'Blog' },
    blog: {
      hero: { a: 'Nosso', b: 'blog' },
      intro: 'Mensagens, novidades e reflexões da nossa comunidade, em três idiomas.',
      readMore: 'Ler mais',
      back: 'Voltar ao blog',
      empty: 'Ainda não há publicações no blog. Volte em breve!',
      by: 'Por',
      passage: 'Passagem bíblica',
      filterLabel: 'Filtrar por categoria',
      allCategories: 'Todas',
      primaryPost: 'Postagem principal',
      recentPosts: 'Mais recentes',
      morePosts: 'Mais publicações',
      search: 'Pesquisar no blog',
      searchPlaceholder: 'Buscar publicações',
      searchSubmit: 'Pesquisar',
      relatedPosts: 'Leia também',
      moreRelatedPosts: 'Mais para você',
      noResults: 'Nenhuma publicação encontrada para esta busca.',
    },
    notFound: {
      eyebrow: 'Erro 404',
      title: 'Este caminho não leva a lugar nenhum.',
      text: 'Talvez o endereço tenha mudado. Volte para um lugar conhecido e continue caminhando com a gente.',
      home: 'Ir para o início',
      blog: 'Explorar o blog',
    },
    ui: {
      skip: 'Pular para o conteúdo', menu: 'Abrir menu', closeMenu: 'Fechar menu', language: 'Escolher idioma', mainNav: 'Navegação principal',
      talk: 'Fale com a gente', whatsapp: 'Chamar no WhatsApp', call: 'Ligar agora', planVisit: 'Planeje sua visita', seeTimes: 'Ver horários',
      openMap: 'Abrir no Google Maps', mapTitle: 'Mapa com a localização da Missão Internacional Resgate',
      // Mensagem que já aparece escrita ao abrir a conversa no WhatsApp por qualquer botão do site.
      whatsappMessage: 'Olá! Vi o site da Missão Internacional Resgate e gostaria de mais informações sobre a igreja.',
    },
    times: [
      { day: 'Sexta-feira', hour: '20h — 21h30' },
      { day: 'Sábado', hour: '16h — 18h' },
      { day: 'Domingo', hour: '10h — 12h' },
    ],
    footer: {
      about: 'Uma igreja evangélica em São José de portas abertas para gente de todos os cantos do mundo.',
      navTitle: 'Navegação', timesTitle: 'Horários', contactTitle: 'Contato', socialTitle: 'Redes sociais',
      rights: 'Missão Internacional Resgate. Todos os direitos reservados.',
    },
    photos: {
      facade: 'Fachada da igreja com bandeiras de vários países',
      hall: 'Salão da igreja com cadeiras laranja e bandeiras de vários países',
      hallTables: 'Salão da igreja com mezanino de madeira, cadeiras e mesas',
      worship: 'Pessoas em pé durante um culto da igreja',
      preaching: 'Pregador falando para a congregação',
      congregation: 'Congregação reunida em louvor no salão da igreja',
      gathering: 'Pessoas reunidas durante um encontro da igreja',
      praise: 'Pessoas em louvor durante um encontro',
    },
    home: {
      hero: {
        eyebrow: 'Forquilhinhas · São José · SC',
        title: 'Uma casa para quem veio de longe.',
        welcome: 'Boas-vindas à Missão Internacional Resgate',
        schedule: 'Sextas 20h · Sábados 16h · Domingos 10h',
        intro: 'Aqui tem fé, mesa aberta e gente de muitos países. Venha como você está: sempre tem um lugar e uma família esperando por você.',
      },
      pillars: [
        { title: 'Acolher', script: 'Uma família de muitas nações', link: 'Conheça a igreja', text: 'Somos uma igreja em São José que abraça de um jeito especial <strong>quem veio de outro país</strong>. Aqui, cada história tem lugar e ninguém caminha sozinho.' },
        { title: 'Crescer', script: 'Fé vivida em comunidade', link: 'Ver os encontros', text: 'Nos encontramos às sextas, sábados e domingos, sempre <strong>em espanhol</strong>. É um lugar para a comunidade latina se sentir em casa, e todo mundo é bem-vindo.' },
        { title: 'Servir', script: 'Amor em pequenos gestos', link: 'Conheça as ações', text: 'Repartimos roupas com respeito e montamos uma <strong>mesa aberta</strong>: cada um traz um pouco e todo mundo come junto. É assim que cuidamos uns dos outros.' },
      ],
      // PROVISÓRIO: frase de missão baseada nos textos atuais do site.
      mission: { label: 'Nossa missão:', statement: 'Ser uma casa para quem veio de longe, onde cada história tem lugar.', link: 'Quem somos' },
      featured: {
        eyebrow: 'Do nosso blog',
        title: 'Histórias para caminhar junto.',
        intro: 'Mensagens, reflexões e novidades da nossa comunidade para levar com você durante a semana.',
        link: 'Ver todo o blog',
      },
    },
    church: {
      hero: { a: 'Nossa', b: 'casa' },
      statement: 'Uma família de muitos sotaques.',
      intro: 'Somos uma igreja evangélica no bairro <strong>Forquilhinhas, em São José</strong>, feita de gente de muitos países. Tem bandeiras na fachada, portas abertas e sempre uma cadeira a mais para você.',
      blocks: [
        { title: 'Quem somos', script: 'Gente de todo canto', text: 'A Missão Internacional Resgate é uma igreja que recebe com carinho quem está longe de casa. Venha como você está: aqui você encontra <strong>amizade, cuidado e uma família</strong> para caminhar junto.' },
        { title: 'Cultos em espanhol', script: 'Fé no idioma do coração', text: 'Nossos cultos são em espanhol, para a <strong>comunidade latina</strong> poder louvar e orar na própria língua. E quem fala outro idioma também é muito bem-vindo.' },
        // PROVISÓRIO: aguardando a história da igreja.
        { title: 'Nossa história', script: 'Como tudo começou', text: 'Em breve vamos contar aqui a nossa história: como tudo começou, quem cuida da igreja e por que abrimos as portas para todas as nações.' },
      ],
      gallery: { title: 'Um lugar para chamar de seu.', text: 'Um pouco do nosso cantinho, cheio de bandeiras e de gente de muitos lugares.' },
      // Fecho da página: o próximo passo de quem acabou de conhecer a igreja.
      next: { title: 'Venha nos conhecer', text: 'Nos reunimos <strong>às sextas, sábados e domingos</strong>, sempre em espanhol. A porta está aberta: é só chegar.' },
    },
    gatherings: {
      hero: { a: 'Nossos', b: 'encontros' },
      statement: 'Escolha o melhor dia e venha estar com a gente.',
      intro: 'São três encontros por semana, todos <strong>em espanhol</strong>. A porta está aberta: é só chegar.',
      timesTitle: 'Horários',
      blocks: [
        // PROVISÓRIO: aguardando a descrição de como é um encontro.
        { title: 'O que esperar', script: 'Venha como você está', text: 'Em breve vamos contar aqui como é um encontro com a gente. Por enquanto, pode ter certeza: você vai ser recebido com carinho, venha de onde vier.' },
        { title: 'Primeira vez?', script: 'Estamos te esperando', text: 'Se quiser, mande uma mensagem no <strong>WhatsApp</strong> antes de vir. Vamos adorar tirar suas dúvidas e te receber.' },
      ],
    },
    outreach: {
      hero: { a: 'Nossas', b: 'ações' },
      statement: 'Quando a fé vira cuidado.',
      intro: 'São gestos simples, feitos com carinho, para cuidar de quem está chegando e deixar a nossa comunidade mais unida.',
      blocks: [
        { title: 'Roupas que circulam', script: 'Doar com respeito', text: 'Recebemos roupas e repassamos para quem precisa, sempre com <strong>respeito e carinho</strong> por cada história.' },
        { title: 'Mesa compartilhada', script: 'Comida, conversa e amizade', text: 'Em alguns encontros, cada um traz um prato ou um pouquinho do que tem. Juntos, fazemos um <strong>almoço cheio de conversa e amizade</strong>.' },
      ],
      // PROVISÓRIO: confirmar como as pessoas podem ajudar.
      help: { title: 'Quer ajudar?', text: 'Se quiser doar roupas ou participar da mesa compartilhada, é só chamar a gente no WhatsApp.' },
    },
    visit: {
      hero: { title: 'Guardamos um lugar para você.' },
      meet: { title: 'Mal podemos esperar para te conhecer!', text: 'Que bom ter você por aqui! Na Missão Internacional Resgate, você não é visita: <strong>é família</strong>. Venha como você está e conheça uma igreja de muitos países, com encontros <strong>em espanhol</strong>.' },
      location: { title: 'Como chegar', script: 'Procure as bandeiras', text: 'Ficamos no bairro Forquilhinhas, em São José, na Grande Florianópolis. É fácil achar: procure a fachada com as bandeiras de vários países.' },
      mapBand: { title: 'Venha nos visitar', script: 'A porta está aberta', text: 'Chegue uns minutinhos antes e receba um abraço na entrada. <strong>Você não precisa conhecer ninguém</strong> para se sentir em casa.' },
      faqTitle: 'Perguntas frequentes',
      // PROVISÓRIO: perguntas montadas com as informações atuais. Revisar e completar.
      faq: [
        { q: 'Que tipo de igreja é a Missão Internacional Resgate?', a: 'Uma igreja evangélica de portas abertas para gente de todos os países, com cultos em espanhol, no bairro Forquilhinhas, em São José (SC).' },
        { q: 'Quando acontecem os encontros?', a: 'Às sextas, das 20h às 21h30; aos sábados, das 16h às 18h; e aos domingos, das 10h às 12h.' },
        { q: 'Em que idioma são os cultos?', a: 'Em espanhol. A comunidade latina se sente em casa, e quem fala outros idiomas também é muito bem-vindo, venha de onde vier.' },
        { q: 'Onde fica a igreja?', a: 'Na Rua Vereador Manoel Mariano, 2014, no bairro Forquilhinhas, em São José (SC). É só procurar a fachada com as bandeiras de vários países.' },
        { q: 'A igreja fica perto de Florianópolis?', a: 'Sim. São José faz parte da Grande Florianópolis e faz divisa com a capital. Quem mora em Florianópolis, Palhoça ou Biguaçu é muito bem-vindo.' },
        { q: 'Como devo me vestir?', a: 'Do jeito que você se sentir bem. O mais importante é você estar com a gente.' },
        { q: 'Ficou alguma dúvida?', a: 'Chame a gente no WhatsApp ou ligue para (48) 98831-3964. Vamos adorar conversar com você.' },
      ],
    },
  },

  es: {
    meta: {
      titles: { home: 'Iglesia evangélica en São José, SC', church: 'La Iglesia en Forquilhinhas, São José', gatherings: 'Horarios de los cultos en español', outreach: 'Acciones solidarias y donación de ropa', visit: 'Dirección en Forquilhinhas, São José', blog: 'Blog' },
      descriptions: {
        home: 'Iglesia evangélica con cultos en español en Forquilhinhas, São José (SC), en la Gran Florianópolis. Viernes, sábados y domingos, abierta a todos los países.',
        church: 'Conoce Missão Internacional Resgate, una iglesia evangélica en Forquilhinhas, São José (SC), hecha de gente de muchos países y con cultos en español.',
        gatherings: 'Cultos en español en São José (SC), en la Gran Florianópolis: viernes de 20:00 a 21:30, sábados de 16:00 a 18:00 y domingos de 10:00 a 12:00.',
        outreach: 'Donación de ropa y mesa compartida: así cuida Missão Internacional Resgate a quienes llegan de otros países a São José (SC).',
        visit: 'Rua Vereador Manoel Mariano, 2014, Forquilhinhas, São José (SC), en la Gran Florianópolis. Mira el mapa y los horarios, y escríbenos por WhatsApp.',
        blog: 'Mensajes, novedades y reflexiones de Missão Internacional Resgate, iglesia evangélica en Forquilhinhas, São José (SC).',
      },
      shareImageAlt: 'Página de inicio del sitio de Missão Internacional Resgate: "Uma casa para quem veio de longe.", con los horarios de los cultos',
    },
    nav: { home: 'Inicio', church: 'La Iglesia', gatherings: 'Encuentros', outreach: 'Acciones', visit: 'Visítanos', blog: 'Blog' },
    blog: {
      hero: { a: 'Nuestro', b: 'blog' },
      intro: 'Mensajes, novedades y reflexiones de nuestra comunidad, en tres idiomas.',
      readMore: 'Leer más',
      back: 'Volver al blog',
      empty: 'Todavía no hay publicaciones en el blog. ¡Vuelve pronto!',
      by: 'Por',
      passage: 'Pasaje bíblico',
      filterLabel: 'Filtrar por categoría',
      allCategories: 'Todas',
      primaryPost: 'Publicación principal',
      recentPosts: 'Más recientes',
      morePosts: 'Más publicaciones',
      search: 'Buscar en el blog',
      searchPlaceholder: 'Buscar publicaciones',
      searchSubmit: 'Buscar',
      relatedPosts: 'También te puede interesar',
      moreRelatedPosts: 'Más para ti',
      noResults: 'No se encontraron publicaciones para esta búsqueda.',
    },
    notFound: {
      eyebrow: 'Error 404',
      title: 'Este camino no lleva a ningún lugar.',
      text: 'Puede que la dirección haya cambiado. Vuelve a un lugar conocido y sigue caminando con nosotros.',
      home: 'Ir al inicio',
      blog: 'Explorar el blog',
    },
    ui: {
      skip: 'Saltar al contenido', menu: 'Abrir menú', closeMenu: 'Cerrar menú', language: 'Elegir idioma', mainNav: 'Navegación principal',
      talk: 'Escríbenos', whatsapp: 'Escribir por WhatsApp', call: 'Llamar ahora', planVisit: 'Planea tu visita', seeTimes: 'Ver horarios',
      openMap: 'Abrir en Google Maps', mapTitle: 'Mapa con la ubicación de Missão Internacional Resgate',
      whatsappMessage: '¡Hola! Vi el sitio de Missão Internacional Resgate y me gustaría recibir más información sobre la iglesia.',
    },
    times: [
      { day: 'Viernes', hour: '20:00 — 21:30' },
      { day: 'Sábado', hour: '16:00 — 18:00' },
      { day: 'Domingo', hour: '10:00 — 12:00' },
    ],
    footer: {
      about: 'Una iglesia evangélica en São José con las puertas abiertas para gente de todos los rincones del mundo.',
      navTitle: 'Navegación', timesTitle: 'Horarios', contactTitle: 'Contacto', socialTitle: 'Redes sociales',
      rights: 'Missão Internacional Resgate. Todos los derechos reservados.',
    },
    photos: {
      facade: 'Fachada de la iglesia con banderas de varios países',
      hall: 'Salón de la iglesia con sillas naranjas y banderas de varios países',
      hallTables: 'Salón de la iglesia con entrepiso de madera, sillas y mesas',
      worship: 'Personas de pie durante un culto de la iglesia',
      preaching: 'Predicador hablando a la congregación',
      congregation: 'Congregación reunida en alabanza en el salón de la iglesia',
      gathering: 'Personas reunidas durante un encuentro de la iglesia',
      praise: 'Personas en alabanza durante un encuentro',
    },
    home: {
      hero: {
        eyebrow: 'Forquilhinhas · São José · SC',
        title: 'Un hogar para quien vino de lejos.',
        welcome: 'Bienvenidos a Missão Internacional Resgate',
        schedule: 'Viernes 20:00 · Sábados 16:00 · Domingos 10:00',
        intro: 'Aquí hay fe, una mesa abierta y gente de muchos países. Ven tal como eres: siempre hay un lugar y una familia esperándote.',
      },
      pillars: [
        { title: 'Acoger', script: 'Una familia de muchas naciones', link: 'Conoce la iglesia', text: 'Somos una iglesia en São José que abraza de manera especial a <strong>quien vino de otro país</strong>. Aquí, cada historia tiene lugar y nadie camina solo.' },
        { title: 'Crecer', script: 'Fe vivida en comunidad', link: 'Ver los encuentros', text: 'Nos reunimos los viernes, sábados y domingos, siempre <strong>en español</strong>. Es un lugar donde la comunidad latina se siente en casa, y todos son bienvenidos.' },
        { title: 'Servir', script: 'Amor en pequeños gestos', link: 'Conoce las acciones', text: 'Compartimos ropa con respeto y armamos una <strong>mesa abierta</strong>: cada uno trae un poco y todos comen juntos. Así nos cuidamos unos a otros.' },
      ],
      // PROVISÓRIO
      mission: { label: 'Nuestra misión:', statement: 'Ser un hogar para quien vino de lejos, donde cada historia tiene lugar.', link: 'Quiénes somos' },
      featured: {
        eyebrow: 'De nuestro blog',
        title: 'Historias para caminar juntos.',
        intro: 'Mensajes, reflexiones y novedades de nuestra comunidad para acompañarte durante la semana.',
        link: 'Ver todo el blog',
      },
    },
    church: {
      hero: { a: 'Nuestro', b: 'hogar' },
      statement: 'Una familia de muchos acentos.',
      intro: 'Somos una iglesia evangélica en el barrio <strong>Forquilhinhas, en São José</strong>, hecha de gente de muchos países. Hay banderas en la fachada, puertas abiertas y siempre una silla más para ti.',
      blocks: [
        { title: 'Quiénes somos', script: 'Gente de todos los rincones', text: 'Missão Internacional Resgate es una iglesia que recibe con cariño a quien está lejos de casa. Ven tal como eres: aquí encuentras <strong>amistad, cuidado y una familia</strong> para caminar juntos.' },
        { title: 'Cultos en español', script: 'Fe en el idioma del corazón', text: 'Nuestros cultos son en español, para que la <strong>comunidad latina</strong> pueda alabar y orar en su propio idioma. Y quien habla otro idioma también es muy bienvenido.' },
        // PROVISÓRIO
        { title: 'Nuestra historia', script: 'Cómo empezó todo', text: 'Muy pronto contaremos aquí nuestra historia: cómo empezó todo, quién cuida de la iglesia y por qué abrimos las puertas a todas las naciones.' },
      ],
      gallery: { title: 'Un lugar para sentirte en casa.', text: 'Un poco de nuestro rinconcito, lleno de banderas y de gente de muchos lugares.' },
      next: { title: 'Ven a conocernos', text: 'Nos reunimos <strong>los viernes, sábados y domingos</strong>, siempre en español. La puerta está abierta: solo tienes que llegar.' },
    },
    gatherings: {
      hero: { a: 'Nuestros', b: 'encuentros' },
      statement: 'Elige el mejor día y ven a estar con nosotros.',
      intro: 'Son tres encuentros por semana, todos <strong>en español</strong>. La puerta está abierta: solo tienes que llegar.',
      timesTitle: 'Horarios',
      blocks: [
        // PROVISÓRIO
        { title: 'Qué esperar', script: 'Ven tal como eres', text: 'Muy pronto contaremos aquí cómo es un encuentro con nosotros. Por ahora, puedes estar seguro: serás recibido con cariño, vengas de donde vengas.' },
        { title: '¿Primera vez?', script: 'Te estamos esperando', text: 'Si quieres, escríbenos por <strong>WhatsApp</strong> antes de venir. Nos encantará responder tus preguntas y recibirte.' },
      ],
    },
    outreach: {
      hero: { a: 'Nuestras', b: 'acciones' },
      statement: 'Cuando la fe se hace cuidado.',
      intro: 'Son gestos sencillos, hechos con cariño, para cuidar de quienes están llegando y unir más a nuestra comunidad.',
      blocks: [
        { title: 'Ropa que circula', script: 'Donar con respeto', text: 'Recibimos ropa y la entregamos a quien la necesita, siempre con <strong>respeto y cariño</strong> por cada historia.' },
        { title: 'Mesa compartida', script: 'Comida, conversación y amistad', text: 'En algunos encuentros, cada uno trae un plato o un poquito de lo que tiene. Juntos hacemos un <strong>almuerzo lleno de conversación y amistad</strong>.' },
      ],
      // PROVISÓRIO
      help: { title: '¿Quieres ayudar?', text: 'Si quieres donar ropa o participar en la mesa compartida, solo tienes que escribirnos por WhatsApp.' },
    },
    visit: {
      hero: { title: 'Te guardamos un lugar.' },
      meet: { title: '¡Tenemos muchas ganas de conocerte!', text: '¡Qué bueno tenerte aquí! En Missão Internacional Resgate no eres una visita: <strong>eres familia</strong>. Ven tal como eres y conoce una iglesia de muchos países, con encuentros <strong>en español</strong>.' },
      location: { title: 'Cómo llegar', script: 'Busca las banderas', text: 'Estamos en el barrio Forquilhinhas, en São José, en la Gran Florianópolis. Es fácil encontrarnos: busca la fachada con las banderas de varios países.' },
      mapBand: { title: 'Ven a visitarnos', script: 'La puerta está abierta', text: 'Llega unos minutitos antes y recibe un abrazo en la entrada. <strong>No necesitas conocer a nadie</strong> para sentirte en casa.' },
      faqTitle: 'Preguntas frecuentes',
      // PROVISÓRIO
      faq: [
        { q: '¿Qué tipo de iglesia es Missão Internacional Resgate?', a: 'Una iglesia evangélica con las puertas abiertas para gente de todos los países, con cultos en español, en el barrio Forquilhinhas, São José (SC).' },
        { q: '¿Cuándo son los encuentros?', a: 'Los viernes, de 20:00 a 21:30; los sábados, de 16:00 a 18:00; y los domingos, de 10:00 a 12:00.' },
        { q: '¿En qué idioma son los cultos?', a: 'En español. La comunidad latina se siente en casa, y quien habla otros idiomas también es muy bienvenido, venga de donde venga.' },
        { q: '¿Dónde está la iglesia?', a: 'En la Rua Vereador Manoel Mariano, 2014, barrio Forquilhinhas, São José (SC). Solo busca la fachada con las banderas de varios países.' },
        { q: '¿La iglesia queda cerca de Florianópolis?', a: 'Sí. São José forma parte de la Gran Florianópolis y limita con la capital. Si vives en Florianópolis, Palhoça o Biguaçu, eres muy bienvenido.' },
        { q: '¿Cómo debo vestirme?', a: 'Como te sientas cómodo. Lo más importante es que estés con nosotros.' },
        { q: '¿Te quedó alguna duda?', a: 'Escríbenos por WhatsApp o llámanos al (48) 98831-3964. Nos encantará conversar contigo.' },
      ],
    },
  },

  en: {
    meta: {
      titles: { home: 'Evangelical church in São José, SC', church: 'The Church in Forquilhinhas, São José', gatherings: 'Spanish-language service times', outreach: 'Outreach and clothing donations', visit: 'Address in Forquilhinhas, São José', blog: 'Blog' },
      descriptions: {
        home: 'An evangelical church in Forquilhinhas, São José (SC), Brazil, open to people from every country. Services in Spanish on Fridays, Saturdays, and Sundays.',
        church: 'Meet Missão Internacional Resgate: an evangelical church in Forquilhinhas, São José (SC), with people from many countries and services in Spanish.',
        gatherings: 'Spanish-language services in São José (SC), Greater Florianópolis: Fridays 8–9:30 PM, Saturdays 4–6 PM, and Sundays 10 AM–12 PM, in Forquilhinhas.',
        outreach: 'Clothing donations and a shared table: how Missão Internacional Resgate cares for people arriving from other countries in São José (SC), Brazil.',
        visit: 'Rua Vereador Manoel Mariano, 2014, Forquilhinhas, São José (SC), Brazil. See the map and service times, and message us on WhatsApp.',
        blog: 'Messages, news, and reflections from Missão Internacional Resgate, an evangelical church in Forquilhinhas, São José (SC), Brazil.',
      },
      shareImageAlt: 'Missão Internacional Resgate home page: "Uma casa para quem veio de longe." ("A home for those who came from afar"), with service times',
    },
    nav: { home: 'Home', church: 'The Church', gatherings: 'Gatherings', outreach: 'Outreach', visit: 'Visit', blog: 'Blog' },
    blog: {
      hero: { a: 'Our', b: 'blog' },
      intro: 'Messages, news, and reflections from our community, in three languages.',
      readMore: 'Read more',
      back: 'Back to blog',
      empty: 'There are no blog posts yet. Come back soon!',
      by: 'By',
      passage: 'Scripture',
      filterLabel: 'Filter by category',
      allCategories: 'All',
      primaryPost: 'Main post',
      recentPosts: 'Latest posts',
      morePosts: 'More posts',
      search: 'Search the blog',
      searchPlaceholder: 'Search posts',
      searchSubmit: 'Search',
      relatedPosts: 'You may also like',
      moreRelatedPosts: 'More for you',
      noResults: 'No posts were found for this search.',
    },
    notFound: {
      eyebrow: 'Error 404',
      title: 'This path does not lead anywhere.',
      text: 'The address may have changed. Return to a familiar place and keep walking with us.',
      home: 'Go to home',
      blog: 'Explore the blog',
    },
    ui: {
      skip: 'Skip to content', menu: 'Open menu', closeMenu: 'Close menu', language: 'Choose language', mainNav: 'Main navigation',
      talk: 'Talk to us', whatsapp: 'Message on WhatsApp', call: 'Call now', planVisit: 'Plan your visit', seeTimes: 'See gathering times',
      openMap: 'Open in Google Maps', mapTitle: 'Map showing the location of Missão Internacional Resgate',
      whatsappMessage: 'Hi! I saw the Missão Internacional Resgate website and would like more information about the church.',
    },
    times: [
      { day: 'Friday', hour: '8:00 PM — 9:30 PM' },
      { day: 'Saturday', hour: '4:00 PM — 6:00 PM' },
      { day: 'Sunday', hour: '10:00 AM — 12:00 PM' },
    ],
    footer: {
      about: 'An evangelical church in São José with open doors for people from every corner of the world.',
      navTitle: 'Explore', timesTitle: 'Gathering times', contactTitle: 'Contact', socialTitle: 'Social media',
      rights: 'Missão Internacional Resgate. All rights reserved.',
    },
    photos: {
      facade: 'Front of the church building with flags from many countries',
      hall: 'Church hall with orange chairs and flags from many countries',
      hallTables: 'Church hall with a wooden mezzanine, chairs, and tables',
      worship: 'People standing during a church service',
      preaching: 'Preacher speaking to the congregation',
      congregation: 'Congregation gathered in worship in the church hall',
      gathering: 'People gathered during a church meeting',
      praise: 'People worshipping during a gathering',
    },
    home: {
      hero: {
        eyebrow: 'Forquilhinhas · São José · SC',
        title: 'A home for those who came from far away.',
        welcome: 'Welcome to Missão Internacional Resgate',
        schedule: 'Fridays 8 PM · Saturdays 4 PM · Sundays 10 AM',
        intro: 'Here you’ll find faith, an open table, and people from many countries. Come as you are: there’s always a seat and a family waiting for you.',
      },
      pillars: [
        { title: 'Welcome', script: 'One family, many nations', link: 'Meet the church', text: 'We are a church in São José with a special place in our hearts for <strong>people who came from another country</strong>. Here, every story belongs and no one walks alone.' },
        { title: 'Grow', script: 'Faith lived in community', link: 'See the gatherings', text: 'We meet on Fridays, Saturdays, and Sundays, always <strong>in Spanish</strong>. It’s a place where the Latin community feels at home, and everyone is welcome.' },
        { title: 'Serve', script: 'Love in small ways', link: 'See our outreach', text: 'We share clothes with respect and set an <strong>open table</strong>: everyone brings a little and we all eat together. That’s how we look after one another.' },
      ],
      // PROVISÓRIO
      mission: { label: 'Our mission:', statement: 'To be a home for those who came from far away, where every story belongs.', link: 'Who we are' },
      featured: {
        eyebrow: 'From our blog',
        title: 'Stories to walk with you.',
        intro: 'Messages, reflections, and news from our community to carry with you throughout the week.',
        link: 'See the full blog',
      },
    },
    church: {
      hero: { a: 'Our', b: 'home' },
      statement: 'One family, many accents.',
      intro: 'We are an evangelical church in the <strong>Forquilhinhas neighborhood of São José</strong>, made up of people from many countries. Flags out front, open doors, and always an extra chair for you.',
      blocks: [
        { title: 'Who we are', script: 'People from everywhere', text: 'Missão Internacional Resgate is a church that warmly welcomes anyone far from home. Come as you are: here you’ll find <strong>friendship, care, and a family</strong> to walk with you.' },
        { title: 'Services in Spanish', script: 'Faith in the language of the heart', text: 'Our services are in Spanish, so the <strong>Latin community</strong> can worship and pray in their own language. And if you speak another language, you are just as welcome.' },
        // PROVISÓRIO
        { title: 'Our story', script: 'How it all began', text: 'Soon we will share our story here: how it all began, who looks after the church, and why we open our doors to every nation.' },
      ],
      gallery: { title: 'A place to call your own.', text: 'A glimpse of our little corner, full of flags and people from many places.' },
      next: { title: 'Come and meet us', text: 'We gather <strong>on Fridays, Saturdays and Sundays</strong>, always in Spanish. The door is open: just come.' },
    },
    gatherings: {
      hero: { a: 'Our', b: 'gatherings' },
      statement: 'Pick the day that suits you and come be with us.',
      intro: 'We gather three times a week, always <strong>in Spanish</strong>. The door is open: just come.',
      timesTitle: 'Gathering times',
      blocks: [
        // PROVISÓRIO
        { title: 'What to expect', script: 'Come as you are', text: 'Soon we will share here what a gathering with us is like. For now, you can be sure of this: you’ll be welcomed warmly, wherever you come from.' },
        { title: 'First time?', script: 'We are waiting for you', text: 'If you like, send us a message on <strong>WhatsApp</strong> before you come. We’d love to answer your questions and welcome you.' },
      ],
    },
    outreach: {
      hero: { a: 'Our', b: 'outreach' },
      statement: 'When faith turns into care.',
      intro: 'Simple gestures, made with love, to care for those who are just arriving and bring our community closer together.',
      blocks: [
        { title: 'Clothes that keep moving', script: 'Giving with respect', text: 'We collect clothes and pass them on to those who need them, always with <strong>respect and care</strong> for every story.' },
        { title: 'A shared table', script: 'Food, conversation, friendship', text: 'At some gatherings, everyone brings a dish or a little of what they have. Together, we make a <strong>lunch full of conversation and friendship</strong>.' },
      ],
      // PROVISÓRIO
      help: { title: 'Want to help?', text: 'If you’d like to donate clothes or join the shared table, just send us a message on WhatsApp.' },
    },
    visit: {
      hero: { title: 'We saved you a seat.' },
      meet: { title: 'We can’t wait to meet you!', text: 'We are so glad you are here! At Missão Internacional Resgate you are not a visitor: <strong>you are family</strong>. Come as you are and meet a church of many countries, with gatherings <strong>in Spanish</strong>.' },
      location: { title: 'Getting here', script: 'Look for the flags', text: 'We are in the Forquilhinhas neighborhood of São José, in Greater Florianópolis. We’re easy to find: look for the building with flags from many countries out front.' },
      mapBand: { title: 'Come visit us', script: 'The door is open', text: 'Arrive a few minutes early and get a hug at the door. <strong>You don’t need to know anyone</strong> to feel at home.' },
      faqTitle: 'Frequently asked questions',
      // PROVISÓRIO
      faq: [
        { q: 'What kind of church is Missão Internacional Resgate?', a: 'An evangelical church with open doors for people from every country, with services in Spanish, in the Forquilhinhas neighborhood of São José (SC), Brazil.' },
        { q: 'When are the gatherings?', a: 'Fridays from 8:00 PM to 9:30 PM, Saturdays from 4:00 PM to 6:00 PM, and Sundays from 10:00 AM to 12:00 PM.' },
        { q: 'What language are the services in?', a: 'Spanish. The Latin community feels right at home, and people who speak other languages are just as welcome, wherever they come from.' },
        { q: 'Where is the church?', a: 'Rua Vereador Manoel Mariano, 2014, in the Forquilhinhas neighborhood of São José (SC). Just look for the building with flags from many countries.' },
        { q: 'Is the church near Florianópolis?', a: 'Yes. São José is part of Greater Florianópolis and borders the state capital. If you live in Florianópolis, Palhoça, or Biguaçu, you are very welcome.' },
        { q: 'What should I wear?', a: 'Whatever feels comfortable. What matters most is that you’re here with us.' },
        { q: 'Still have questions?', a: 'Send us a message on WhatsApp or call (48) 98831-3964. We’d love to hear from you.' },
      ],
    },
  },
};
