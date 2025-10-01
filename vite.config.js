// vite.config.js - The clean, standard configuration
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    // DELETE THE LINE: root: "src/", 
    // Vite will now default to the project root for entry.

    build: {
        outDir: "../dist",
    },
});