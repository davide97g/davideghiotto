import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Local ral-gate: set VITE_RAL_API_URL empty and use /ral-api, or point
      // VITE_RAL_API_URL straight at http://localhost:8787.
      "/ral-api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ral-api/, ""),
      },
    },
  },
  // Tailwind v4 runs as a Vite plugin, not through PostCSS — there is no
  // tailwind.config.ts and no postcss.config.js any more. Every token lives in
  // src/index.css.
  plugins: [react(), tailwindcss(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
