import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — raramente muda, cache longo
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Recharts é grande (~600 kB); chunk separado para cache independente
          'vendor-recharts': ['recharts'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
