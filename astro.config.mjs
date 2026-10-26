import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/data/site.js';

export default defineConfig({
  // O domínio fica em src/data/site.js. Vazio, as tags que dependem dele não são geradas.
  site: site.url || undefined,
  // As páginas institucionais, o blog, o admin, o sitemap e a tradução são renderizados
  // sob demanda para refletir conteúdo publicado sem um novo deploy.
  adapter: cloudflare({
    // O site não usa imagens do Astro: passthrough evita provisionar o binding do Cloudflare Images.
    imageService: 'passthrough',
    // Em `astro dev`, expõe vars e secrets do wrangler (.dev.vars) em locals.runtime.env.
    platformProxy: { enabled: true },
  }),
  build: {
    // Os estilos da página são pequenos; inline evita três requisições bloqueantes no primeiro paint.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  publicDir: './images',
});
