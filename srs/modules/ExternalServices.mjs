// src/modules/ExternalServices.mjs

// Access the API key defined in your .env file
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

// Helper function to handle the fetch request and error checking
async function fetchRecipeData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        // Throw error if the API call fails (e.g., 404, 500, or invalid key)
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

export default class ExternalServices {
    // Method to search for recipes by query
    async searchRecipes(query) {
        // The Spoonacular complexSearch endpoint handles general searches
        const url = `${BASE_URL}/complexSearch?query=${query}&apiKey=${API_KEY}&number=12`;

        // NOTE: Replace 12 with a number that fits your design, it limits results
        const data = await fetchRecipeData(url);

        // data.results is the list of recipes (title, id, image)
        return data.results;
    }

    // NOTE: You will implement getRecipeDetails(id) in Week 6
}