import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the repository name when deploying to GitHub Pages
// at https://<user>.github.io/finhub/
export default defineConfig({
  plugins: [react()],
  base: "/finhub/",
});
