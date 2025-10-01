// src/main.js
import RecipeSearch from './modules/RecipeSearch.mjs';

// The constructor expects the form ID and the results container ID
// These match the IDs we set in index.html
const recipeSearch = new RecipeSearch('#recipe-search-form', '#recipe-results');

// You can add more initializers here later (e.g., UserAuth, Router)
console.log("Application initialized successfully.");