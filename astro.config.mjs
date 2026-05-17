import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://travelwingsusa.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  server: {
    host: '0.0.0.0',
    port: 4322,
  },
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
  },
});
