import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  server: {
    proxy: {
      "/api": {
        target: "http://43.159.61.165:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    react(),
    tailwindcss(),
    command === "build" &&
      nitro({
        preset: process.env.NITRO_PRESET || "cloudflare-pages",
        routeRules: {
          "/api/**": { proxy: "http://43.159.61.165:8000/api/**" },
        },
      }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));


