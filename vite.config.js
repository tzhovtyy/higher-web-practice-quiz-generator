import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        quizzes: resolve(__dirname, "quizzes.html"),
        quiz: resolve(__dirname, "quiz.html"),
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "js/[name].js",
        entryFileNames: "js/[name].js",
      },
    },
  },
  server: {
    open: "/index.html",
  },
});
