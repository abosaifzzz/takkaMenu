import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.PNG", "**/*.png"], // Handles both .PNG and .png

  plugins: [react()],
});
