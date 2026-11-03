// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: change this to your real site URL once you have a domain (e.g. https://parkviewpta.org)
  site: 'https://parkview-pta.netlify.app',
  integrations: [sitemap()],
  // Bilingual-ready: English lives at the site root today. To add Spanish later,
  // duplicate a page under src/pages/es/ (e.g. src/pages/es/index.astro) — it will
  // automatically be served at /es/ with no other config changes needed.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
