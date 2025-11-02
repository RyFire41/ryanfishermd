import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({ filename: "dist/stats.html", gzipSize: true }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
