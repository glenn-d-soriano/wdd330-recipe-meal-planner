// src/modules/RecipeSearch.mjs
import ExternalServices from './ExternalServices.mjs';

const PLACEHOLDER_IMAGE_PATH = '/src/assets/placeholder.png';
// Instantiate the service layer
const services = new ExternalServices();

// Helper function to create the HTML template for one recipe card
function recipeCardTemplate(recipe) {

    const imageUrl = (recipe.image && recipe.image !== '')
        ? recipe.image
        : PLACEHOLDER_IMAGE_PATH;
    return `<li class="recipe-card" data-id="${recipe.id}">
              <img src="${recipe.image}" alt="${recipe.title}">
              <h3>${recipe.title}</h3>
              <p>ID: ${recipe.id}</p> 
              </li>`;
}


export default class RecipeSearch {
    constructor(formSelector, listElementSelector) {
        // Grab the elements from the HTML
        this.form = document.querySelector(formSelector);
        this.listElement = document.querySelector(listElementSelector);

        // Attach the event listener to the form submission
        this.form.addEventListener('submit', this.handleSearch.bind(this));
    }

    // Event handler for form submission
    async handleSearch(event) {
        event.preventDefault(); // Stop the form from submitting traditionally

        const query = this.form.querySelector('input[name="query"]').value.trim();
        if (!query) return; // Do nothing if the search box is empty

        try {
            this.listElement.innerHTML = `<p>Searching for "${query}"...</p>`;

            // Call the API service
            const results = await services.searchRecipes(query);

            // Display the results
            this.displayResults(results);

        } catch (error) {
            console.error("Recipe search failed:", error);
            this.listElement.innerHTML = `<p class="error">An error occurred while fetching recipes. Check your API key and try again.</p>`;
        }
    }

    // Method to render the list of recipe cards
    displayResults(recipes) {
        this.listElement.innerHTML = ''; // Clear the "Searching..." message

        if (recipes.length === 0) {
            this.listElement.innerHTML = `<p>No recipes found. Try a different search term.</p>`;
            return;
        }

        // Build the final HTML string from the array of recipe objects
        const html = recipes.map(recipe => recipeCardTemplate(recipe)).join('');

        // Inject the final list into the results container
        this.listElement.innerHTML = `<ul>${html}</ul>`;
    }
}