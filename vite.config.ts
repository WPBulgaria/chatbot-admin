import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export default defineConfig({
  plugins: [react(), tailwindcss(), TanStackRouterVite()],
 // base: process.env.NODE_ENV !== "development" ? '/apps/audit/' : "/",
  server: {
    port: 3039,
    host: true,
    allowedHosts: ['wpstudio.local', 'localhost', '127.0.0.1', 'wpbulgaria.com'],
  },
});

