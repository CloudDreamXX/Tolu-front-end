import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tsChecker from "vite-plugin-checker";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import path from "path";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tsChecker({ typescript: true }),
    eslintPlugin(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
  },
});
