import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Epiphany',
    description: 'Flow state tracking and brain-computer interface dashboard',
    version: '0.1.0',
    permissions: ['tabs', 'idle', 'storage'],
    // host_permissions will be added in Phase 6 for URL classification
  },
  // Vite configuration - code splitting handled by React.lazy() in Phase 3+
  vite: () => ({
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
        '@/components': resolve(__dirname, './components'),
        '@/stores': resolve(__dirname, './stores'),
        '@/lib': resolve(__dirname, './lib'),
        '@/assets': resolve(__dirname, './assets'),
      },
    },
  }),
});
