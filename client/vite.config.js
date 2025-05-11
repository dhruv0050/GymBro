import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html"
      }
    }
  },
  server: {
    port: 3000
  },
  base: "./",  // Ensures relative paths in deployment
});
