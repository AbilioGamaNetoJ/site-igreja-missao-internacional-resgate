# Missão Internacional Resgate

Site institucional da **Missão Internacional Resgate**, igreja em Forquilhinhas, São José (SC). O conteúdo apresenta a comunidade, os horários dos encontros, as ações de cuidado e as informações para quem quer visitar.

O site é estático, feito com [Astro](https://astro.build) 7 e [Tailwind CSS](https://tailwindcss.com) 4 (pelo plugin `@tailwindcss/vite`), e publicado na [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) a partir da pasta `dist/`. As dependências e o servidor local usam o [Bun](https://bun.sh). O conteúdo está disponível em três idiomas:

- **Português** na raiz (`/`)
- **Espanhol** em `/es`
- **Inglês** em `/en`

## Páginas

Cada página tem um endereço traduzido por idioma.

| Página | Português | Espanhol | Inglês |
| --- | --- | --- | --- |
| Início | `/` | `/es` | `/en` |
| A Igreja | `/a-igreja` | `/es/la-iglesia` | `/en/the-church` |
| Encontros | `/encontros` | `/es/encuentros` | `/en/gatherings` |
| Ações | `/acoes` | `/es/acciones` | `/en/outreach` |
| Visite | `/visite` | `/es/visitanos` | `/en/visit` |

- **Início** apresenta a igreja, os três pilares (acolher, crescer e servir) e os horários.
- **A Igreja** conta quem é a comunidade, os cultos em espanhol e a história da casa.
- **Encontros** lista os horários de sexta, sábado e domingo e o que esperar de uma primeira visita.
- **Ações** descreve as doações de roupas e a mesa compartilhada.
- **Visite** reúne endereço, mapa, perguntas frequentes e contato por WhatsApp e telefone.

## Instalação

Requisito: [Bun](https://bun.sh) 1.3 ou superior.

```bash
git clone <url-do-repositorio>
cd site-igreja-missao-internacional-resgate
bun install
bun dev
```

O servidor local sobe em [http://localhost:4321](http://localhost:4321).

## Scripts

| Comando | O que faz |
| --- | --- |
| `bun dev` | Sobe o site em modo de desenvolvimento |
| `bun run build` | Gera o site estático na pasta `dist/` |
| `bun run preview` | Serve localmente o resultado do build |
| `bun run deploy` | Gera o site e publica na Cloudflare Workers |

## Publicar na Cloudflare

A configuração fica em `wrangler.jsonc`. O Astro gera as páginas institucionais no build e o Wrangler envia a pasta `dist/` como arquivos estáticos; blog, admin, sitemap e tradução são renderizados sob demanda pelo mesmo Worker (adapter `@astrojs/cloudflare`). O site fica na conta da Cloudflare da igreja, no Worker `site-igreja-missao-internacional-resgate`. O endereço oficial é **https://missaointernacionalresgate.com.br**, definido em `url` no `src/data/site.js`. O Worker também responde em [site-igreja-missao-internacional-resgate.igrejamissaoresgateint.workers.dev](https://site-igreja-missao-internacional-resgate.igrejamissaoresgateint.workers.dev), mas as páginas apontam o canonical para o domínio oficial.

### Credenciais

O deploy usa estas variáveis:

| Variável | Onde encontrar |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta no painel da Cloudflare. |
| `CLOUDFLARE_API_TOKEN` | [API Tokens](https://dash.cloudflare.com/?to=/:account/api-tokens). Token com a permissão **Edit Cloudflare Workers**, limitado à conta da igreja. |
| `PUBLIC_SUPABASE_URL` | Settings → API, no projeto Supabase da igreja (ver seção Blog). |
| `PUBLIC_SUPABASE_ANON_KEY` | Settings → API, no projeto Supabase da igreja. Chave pública por natureza: quem protege os dados é a RLS do banco. |
| `DEEPL_API_KEY` | [DeepL API](https://www.deepl.com/pro-api). O plano gratuito usa chave terminada em `:fx`. Vai como secret do Worker, nunca entra no build. |

Elas ficam em dois lugares:

- **GitHub Actions**: cadastradas como secrets do repositório, em **Settings → Secrets and variables → Actions**.
- **Máquina local**: no arquivo `.env`, que não vai para o Git. Para criar, copie o `.env.example` e preencha os valores.

Se o token for trocado, atualize o `.env` e envie os dois valores para o GitHub com:

```bash
gh secret set -f .env
```

### Deploy automático

Cada push na branch `main` dispara o workflow `.github/workflows/deploy.yml`, que instala as dependências, gera o site e publica em produção. O andamento aparece na aba **Actions** do repositório.

### Deploy manual

Com o `.env` preenchido, publique a partir da máquina local:

```bash
bun run deploy
```

O Wrangler lê o `.env` sozinho, sem precisar de `wrangler login`.

## Blog

O blog roda em `/blog`, `/es/blog` e `/en/blog`, com painel de edição em [cms.missaointernacionalresgate.com.br](https://cms.missaointernacionalresgate.com.br/admin) (também em `/admin` do domínio oficial, que redireciona para lá; fora do menu e dos buscadores). As páginas institucionais continuam pré-renderizadas; blog, admin, sitemap e tradução são renderizados sob demanda pelo Worker, então um post novo entra no ar na hora, sem novo deploy.

### Configuração única (Supabase)

1. Crie o projeto no [Supabase](https://supabase.com) da igreja e rode o `supabase/schema.sql` no SQL Editor. Ele cria as tabelas `posts` e `post_translations`, a tabela `admins`, as políticas de leitura e escrita (RLS) e o bucket público `blog` para as imagens.
2. Em **Authentication → Users**, crie o usuário de cada pessoa que vai escrever (e-mail e senha, cadastro aberto continua desligado).
3. Libere o admin copiando o UID do usuário e rodando no SQL Editor:

   ```sql
   insert into public.admins (user_id, email) values ('<uid>', 'email@exemplo.com');
   ```

4. Preencha `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY` no `.env` (para o build local) e como secrets do GitHub (para o deploy). A chave da DeepL (`DEEPL_API_KEY`) vai no `.dev.vars` para desenvolver e como secret do Worker em produção — o workflow publica ela sozinho a cada deploy.

### Como o blog funciona

- Quem escreve escolhe o idioma do original em `/admin`. Ao publicar, o endpoint `/api/translate` (que roda no Worker, onde fica a chave da DeepL) traduz o texto para os outros dois idiomas e grava as três versões no mesmo instante.
- Corrigir uma tradução no painel marca aquela língua como **editada à mão**; o botão **Atualizar traduções** retraduz apenas as línguas que ninguém editou. O original nunca é sobrescrito.
- O endereço de um post é um slug único, igual nos três idiomas (`/blog/culto-de-pascoa`, `/es/blog/culto-de-pascoa`, `/en/blog/culto-de-pascoa`), para o link nunca mudar.
- Um post só aparece no site quando está publicado **e** tem as três traduções; rascunho fica invisível.
- No editor, **Postagem principal do blog** escolhe a única matéria maior no topo da listagem. Se nenhuma for escolhida, a publicação mais recente ocupa esse espaço.
- O corpo é Markdown sem HTML cru, com capa e imagens no Storage. Leitura pública usa a chave anônima; escrita exige sessão de admin (RLS).

### Painel em subdomínio próprio (cms)

O painel também responde em **https://cms.missaointernacionalresgate.com.br** — o mesmo Worker, com um domínio próprio. A configuração tem duas partes no painel da Cloudflare (conta da igreja), feitas uma única vez:

1. **Ligar o subdomínio ao Worker**: Workers & Pages → `site-igreja-missao-internacional-resgate` → Settings → Domains & Routes → **Add → Custom domain** → `cms.missaointernacionalresgate.com.br`. A Cloudflare cria o DNS e o certificado sozinha. (Se o domínio oficial foi ligado assim, é o mesmo caminho.)

2. **Duas Redirect Rules** (Rules → Redirect Rules), para os caminhos que são servidos antes do Worker (páginas pré-renderizadas) e que o middleware (`src/middleware.js`) não alcança:

   | # | Condição | Destino |
   |---|---|---|
   | 1 | Hostname é `cms.missaointernacionalresgate.com.br` **e** o caminho é `/` | Redirecionar para `https://cms.missaointernacionalresgate.com.br/admin` |
   | 2 | Hostname é `cms.missaointernacionalresgate.com.br` **e** o caminho **não** começa com `/admin`, `/api/`, `/_astro/`, nem é `/favicon.png` ou `/apple-touch-icon.png` | Redirecionar para `https://missaointernacionalresgate.com.br` + o mesmo caminho (regra dinâmica, status 301, preservando a query) |

Com isso: `cms.../` cai direto no painel; o resto do subdomínio manda para o site oficial; e `/admin` no domínio oficial encaminha para o subdomínio (essa parte é o middleware, já no código). O painel envia `noindex` tanto na meta tag quanto no cabeçalho `X-Robots-Tag`.

Para desfazer: remova as regras e o Custom Domain no painel, e apague o `src/middleware.js` — o painel volta a ser acessível em `https://missaointernacionalresgate.com.br/admin`.


## Onde editar

- Textos de cada idioma: `src/i18n/content.js`
- Títulos e descrições de cada página no Google: campo `meta` de cada idioma em `src/i18n/content.js`
- Endereços das páginas: `src/i18n/routes.js`
- Domínio, nome, telefone, endereço, CEP, horários e redes: `src/data/site.js`
- Imagens públicas (logos, fotos, favicon): pasta `images/`
- Imagem da prévia do link no WhatsApp e nas redes: `images/og-image.webp`, um print da home. Ao mudar o topo da home, tire o print de novo.

## SEO e IA

O objetivo é a igreja aparecer nas buscas do bairro (Forquilhinhas), de São José e, para o público que fala espanhol, da Grande Florianópolis. Também queremos que assistentes de IA, como ChatGPT, Claude, Gemini e Perplexity, encontrem e citem o site.

| O quê | Onde | Para quê |
| --- | --- | --- |
| Título, descrição, canonical, hreflang e Open Graph | `src/layouts/BaseLayout.astro` | Resultado do Google e prévia do link no WhatsApp |
| Dados estruturados (JSON-LD) | `src/data/seo.js` | Endereço, CEP, horários, idioma dos cultos, área atendida e perguntas frequentes em formato que buscadores e IAs entendem |
| `/robots.txt` | `src/pages/robots.txt.js` | Libera o site para todos os robôs, com permissão explícita para os de IA |
| `/llms.txt` | `src/pages/llms.txt.js` | Resumo em Markdown para modelos de linguagem |
| `/sitemap.xml` | `src/pages/sitemap.xml.js` | Lista as 15 páginas com as traduções de cada uma |

Tudo é gerado a partir de `src/data/site.js` e `src/i18n/content.js`. Ao mudar um texto, os dados estruturados e o `llms.txt` acompanham. A exceção são os horários: eles aparecem em dois lugares, `times` em `content.js` e `schedule` em `site.js`, e os dois precisam ser atualizados.

### Ligar o domínio ao site

O domínio `missaointernacionalresgate.com.br` está registrado no Registro.br e já foi adicionado à conta da Cloudflare da igreja. Para ele entrar no ar:

1. No [Registro.br](https://registro.br), abra o domínio, vá em **DNS → Alterar servidores DNS** e troque `a.auto.dns.br` e `b.auto.dns.br` pelos servidores que a Cloudflare indicou:
   - `lilyana.ns.cloudflare.com`
   - `sevki.ns.cloudflare.com`
2. Espere o domínio passar de **Pending** para **Active** na Cloudflare. Costuma levar de alguns minutos a algumas horas.
3. Em **Workers & Pages → site-igreja-missao-internacional-resgate → Settings → Domains & Routes**, clique em **Add → Custom domain** e informe `missaointernacionalresgate.com.br`.
4. Para quem digitar `www`: em **DNS → Records**, crie um registro `AAAA` com nome `www`, conteúdo `100::` e proxy ligado (nuvem laranja). Depois, em **Rules → Redirect Rules**, use o modelo **Redirect from WWW to root**. Assim, `www.missaointernacionalresgate.com.br` leva para o endereço sem `www`, e o Google enxerga um único site.

### Liberar os robôs na Cloudflare

A Cloudflare bloqueia robôs de IA por padrão em parte dos domínios, e as regras mudaram em julho e em setembro de 2026. **Bloquear "Training" também bloqueia os robôs que a Cloudflare considera de uso misto (busca e treino)**, o que pode tirar o site de buscadores grandes. Essas opções valem para o domínio próprio e não se aplicam ao endereço `workers.dev`.

Com o domínio ligado ao Worker, abra o painel da Cloudflare, entre no domínio e siga os passos:

1. **Security → Settings → Configure AI bot policies**: deixe **Search**, **Agent** e **Training** em **Allow (do not block)**.
2. Na mesma tela, desligue o **robots.txt gerenciado** (Bot Preference Sync / Manage your robots.txt). Ligado, ele acrescenta regras de bloqueio no topo do nosso `robots.txt`.
3. Desligue o **AI Labyrinth**, que manda robôs de IA para páginas falsas.
4. Desligue o **Bot Fight Mode**. Ele não barra o Google, mas pode desafiar os robôs que buscam páginas na hora em que alguém pergunta algo a uma IA.
5. Em **AI Crawl Control**, confira se nenhum robô está marcado como bloqueado.
6. Em **Caching → Configuration**, ligue o **Crawler Hints**. Ele avisa o Bing e outros buscadores quando o site muda.

Para conferir, abra `https://missaointernacionalresgate.com.br/robots.txt`. O arquivo precisa começar com `# Missão Internacional Resgate`, sem linhas `Disallow` antes.

### Depois de publicar

1. **Perfil da Empresa no Google** ([business.google.com](https://business.google.com)): é o que mais pesa para aparecer no mapa e em "igreja perto de mim". Use o mesmo nome, endereço e telefone do site, a categoria **Igreja evangélica**, os horários dos cultos e fotos da fachada.
2. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)): cadastre o domínio e envie `https://missaointernacionalresgate.com.br/sitemap.xml`.
3. **Bing Webmaster Tools** ([bing.com/webmasters](https://www.bing.com/webmasters)): envie o mesmo sitemap. A busca do ChatGPT e o Copilot usam o índice do Bing.
4. **Redes sociais**: preencha os links em `social`, em `src/data/site.js`. Eles entram nos dados estruturados e ajudam buscadores e IAs a reconhecer que os perfis são da igreja.
5. Para testar os dados estruturados, use o [Teste de pesquisa aprimorada](https://search.google.com/test/rich-results) do Google e o [validador do schema.org](https://validator.schema.org).
