import { defineConfig } from 'wxt';

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
  // WXT handles most build optimization automatically
  vite: () => ({
    // Future: Add custom Vite plugins here if needed
  }),
});
