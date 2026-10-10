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

A configuração fica em `wrangler.jsonc`. O Astro gera as páginas no build e o Wrangler envia a pasta `dist/` como arquivos estáticos. O site fica na conta da Cloudflare da igreja, no Worker `site-igreja-missao-internacional-resgate`. O endereço oficial é **https://missaointernacionalresgate.com.br**, definido em `url` no `src/data/site.js`. O Worker também responde em [site-igreja-missao-internacional-resgate.igrejamissaoresgateint.workers.dev](https://site-igreja-missao-internacional-resgate.igrejamissaoresgateint.workers.dev), mas as páginas apontam o canonical para o domínio oficial.

### Credenciais

O deploy usa duas variáveis:

| Variável | Onde encontrar |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta no painel da Cloudflare. |
| `CLOUDFLARE_API_TOKEN` | [API Tokens](https://dash.cloudflare.com/?to=/:account/api-tokens). Token com a permissão **Edit Cloudflare Workers**, limitado à conta da igreja. |

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

## Onde editar

- Textos de cada idioma: `src/i18n/content.js`
- Títulos e descrições de cada página no Google: campo `meta` de cada idioma em `src/i18n/content.js`
- Endereços das páginas: `src/i18n/routes.js`
- Domínio, nome, telefone, endereço, CEP, horários e redes: `src/data/site.js`
- Imagens públicas (logos, fotos, favicon): pasta `images/`

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
