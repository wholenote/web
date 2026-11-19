import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [
    {
      name: "separate-vite-caches",
      hooks: {
        "astro:config:setup": ({ command, updateConfig }) => {
          // Checks and builds must not replace a running dev server's optimized dependencies.
          updateConfig({ vite: { cacheDir: `./node_modules/.vite/${command}` } });
        },
      },
    },
  ],
  redirects: {
    "/": "/food/",
  },
  build: {
    format: "directory",
  },
});
