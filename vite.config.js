// vite.config.js

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    // FIX 1: Add the base path (CORRECT)
    base: '/wdd330-recipe-meal-planner/',

    // FIX 2: ADD A COMMA HERE!

    build: {
        outDir: "dist", // NOTE: Changed from "../dist" to just "dist" for standard setup
    },
});