import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Set base path for GitHub Pages deployments via env
  base: process.env.VITE_BASE_PATH || "/",
  // This changes the output dir from dist to build
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
          charts: ['recharts', 'd3'],
          supabase: ['@supabase/supabase-js'],
          animation: ['framer-motion']
        }
      }
    }
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: 41296,
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Assuming serverless function runs on 3000 or needs redirection
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix if needed, or keep it depending on server
        bypass: (req, res, options) => {
          // In development without 'vercel dev', we can't easily proxy to serverless functions directly
          // unless we run a separate backend server.
          // For now, let's keep it simple. If running via 'npm start' (vite), 
          // we don't have a backend listener for /api unless we set one up.
          return null;
        }
      }
    }
  }
}));