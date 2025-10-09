// src/recipe-detail.js
import ExternalServices from './ExternalServices.mjs';

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
async function loadRecipeDetails() {
    const recipeId = getRecipeId();
    const detailOutput = document.getElementById('recipe-detail-output');

    if (!recipeId) {
        detailOutput.innerHTML = '<p class="error">No recipe ID found in the URL.</p>';
        return;
    }

    try {
        detailOutput.innerHTML = `<p>Fetching details for ID: ${recipeId}...</p>`;

        // Call the new API service method
        const recipe = await services.getRecipeDetails(recipeId);

        // Display the results using a template function (next step)
        detailOutput.innerHTML = detailTemplate(recipe);

    } catch (error) {
        console.error("Failed to load recipe details:", error);
        detailOutput.innerHTML = `<p class="error">Error loading recipe details. Status: ${error.message}</p>`;
    }
}

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