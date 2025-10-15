// src/recipe-detail.js
import ExternalServices from './ExternalServices.mjs';
import Favorites from './favorites.mjs'; 

const services = new ExternalServices();

// Function to extract the ID from the URL query string
function getRecipeId() {
    // Get the part of the URL after the '?'
    const queryString = window.location.search;
    // Create a URLSearchParams object to easily read parameters
    const urlParams = new URLSearchParams(queryString);
    // Return the value of the 'id' parameter
    return urlParams.get('id');
}

// Function to get and display the recipe details
// src/recipe-detail.js (Updated loadRecipeDetails function)

async function loadRecipeDetails() {
    const recipeId = getRecipeId();

    // 1. Target the correct output container (This is correct)
    const mainOutput = document.getElementById('recipe-detail-output');
    const contentOutput = document.getElementById('recipe-content');

    // Add checks for the elements (good practice)
    if (!mainOutput || !contentOutput) {
        console.error("Missing required HTML elements (#recipe-detail-output or #recipe-content).");
        return;
    }

    // --- CRITICAL RESTORATION: Validation and Error Output ---
    if (!recipeId) {
        mainOutput.innerHTML = '<p class="error">No recipe ID found in the URL.</p>';
        return; // Stop execution if no ID is found
    }
    // -----------------------------------------------------------

    try {
        // Now it's safe to write the fetching message
        contentOutput.innerHTML = `<p>Fetching details for ID: ${recipeId}...</p>`;

        const recipe = await services.getRecipeDetails(recipeId);

        // Prepare the essential data to save to LocalStorage (This is correct)
        const essentialRecipeData = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            extendedIngredients: recipe.extendedIngredients
        };

        // Initialize Favorites (This is correct)
        const favoriteHandler = new Favorites(recipe.id, essentialRecipeData);
        favoriteHandler.initButton();

        // 2. Display results
        contentOutput.innerHTML = detailTemplate(recipe);

    } catch (error) {
        console.error("Failed to load recipe details:", error);
        // Write the API error message to the main output container
        mainOutput.innerHTML = `<p class="error">Error loading recipe details. Status: ${error.message}</p>`;
    }
}

// Start the process when the page loads
loadRecipeDetails();

// Function to structure and format the final HTML for the recipe details
function detailTemplate(recipe) {
    // NOTE: Spoonacular returns HTML for instructions, so we will inject it.
    // Clean up the summary/instructions by removing HTML tags for display
    const summary = recipe.summary.replace(/<[^>]*>/g, '');
    const instructions = recipe.instructions.replace(/<[^>]*>/g, '');

    const ingredients = recipe.extendedIngredients.map(ing =>
        `<li>${ing.amount.toFixed(2)} ${ing.unit} ${ing.name}</li>`
    ).join('');


    return `
        <article class="recipe-detail-card">
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}" class="detail-image">
            
            <section class="meta-info">
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
                <p><strong>Source:</strong> <a href="${recipe.sourceUrl}" target="_blank">${recipe.sourceName}</a></p>
            </section>

            <h3>Summary</h3>
            <p>${summary}</p>

            <h3>Ingredients</h3>
            <ul class="ingredient-list">
                ${ingredients}
            </ul>

            <h3>Instructions</h3>
            <div class="instructions">
                <p>${instructions}</p>
            </div>
        </article>
    `;
}

// Start the process when the page loads
loadRecipeDetails();