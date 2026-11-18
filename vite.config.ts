import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import https from 'https';

// Plugin to proxy real YouTube video search without API key restrictions
function youtubeSearchPlugin() {
  return {
    name: 'youtube-search-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/yt-search', (req: any, res: any) => {
        try {
          const url = new URL(req.url, 'http://localhost:3000');
          const q = url.searchParams.get('q') || '';
          if (!q) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ids: [] }));
            return;
          }

          const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' audio')}`;
          https
            .get(
              ytUrl,
              { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } },
              (ytRes) => {
                let html = '';
                ytRes.on('data', (c) => (html += c));
                ytRes.on('end', () => {
                  const ids: string[] = [];
                  let pos = 0;
                  while (ids.length < 15) {
                    const idx = html.indexOf('"videoId":"', pos);
                    if (idx === -1) break;
                    const id = html.substr(idx + 11, 11);
                    if (!ids.includes(id) && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
                      ids.push(id);
                    }
                    pos = idx + 22;
                  }
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ids }));
                });
              }
            )
            .on('error', (err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message, ids: [] }));
            });
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message, ids: [] }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    youtubeSearchPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Musily - Music & Live Party Sync',
        short_name: 'Musily',
        description: 'Listen to music from YouTube Music & Spotify together, host live party rooms with your friends online for free!',
        theme_color: '#090B10',
        background_color: '#090B10',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  server: {
    port: 3000,
    host: true
  }
});
