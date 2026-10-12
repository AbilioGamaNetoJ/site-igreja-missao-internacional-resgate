import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/data/site.js';

export default defineConfig({
  // O domínio fica em src/data/site.js. Vazio, as tags que dependem dele não são geradas.
  site: site.url || undefined,
  // As páginas institucionais continuam pré-renderizadas; blog, admin, sitemap e tradução
  // são sob demanda (prerender = false em cada rota), então um post novo entra no ar sem deploy.
  adapter: cloudflare({
    // O site não usa imagens do Astro: passthrough evita provisionar o binding do Cloudflare Images.
    imageService: 'passthrough',
    // Em `astro dev`, expõe vars e secrets do wrangler (.dev.vars) em locals.runtime.env.
    platformProxy: { enabled: true },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  publicDir: './images',
});
