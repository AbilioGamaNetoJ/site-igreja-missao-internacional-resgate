import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/data/site.js';

export default defineConfig({
  // O domínio fica em src/data/site.js. Vazio, as tags que dependem dele não são geradas.
  site: site.url || undefined,
  vite: {
    plugins: [tailwindcss()],
  },
  publicDir: './images',
});
