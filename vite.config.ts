// Static build for GitHub Pages (https://mancormemec-stack.github.io/stock/).
// The Lovable demo is a single client-side screen with sample data: no server functions,
// no API routes, no secrets. TanStack Start runs in SPA mode and prerenders the shell to index.html.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/stock/",
  },
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: { outputPath: "/index.html" },
    },
  },
});
