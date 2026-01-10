import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        quizzes: resolve(__dirname, "quizzes.html"),
        quiz: resolve(__dirname, "quiz.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["nanoid", "zod", "idb"],
  },
});
