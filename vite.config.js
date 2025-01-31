import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // Enable global test functions (like describe, it)
    environment: "jsdom", // Simulate a browser-like environment
    setupFiles: "./__tests__/setup.js", // Setup file for additional configurations
  },
});
