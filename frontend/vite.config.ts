import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
    },
  },
  build: {
    rollupOptions: {
      external: [
        "@safe-globalThis/safe-apps-sdk",
        "@safe-globalThis/safe-apps-provider",
        // ... other external modules ...
      ],
    },
  },
  plugins: [react()],
});
