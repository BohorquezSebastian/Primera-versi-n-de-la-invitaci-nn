import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Mantiene correctas las rutas aunque GitHub Pages publique dentro de /repositorio/.
  base: "./",
});
