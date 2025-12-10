import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        search: "search.html",
        movie: "movie.html",
      },
    },
    outDir: "dist",
  },
});
