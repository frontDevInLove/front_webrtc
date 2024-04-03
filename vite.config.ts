import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
});
