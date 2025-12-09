import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 设置 @ 指向 src
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:48912", // Python 后端地址
        changeOrigin: true,
      },
    },
  },
});
