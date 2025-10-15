// src/modules/ShoppingListGenerator.js

// --- 1. UTILITY FUNCTIONS (Consolidated from utils.mjs) ---
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function qs(selector) {
    return document.querySelector(selector);
}

// --- 2. SHOPPING LIST LOGIC ---

const MEAL_PLAN_KEY = 'current-meal-plan';
const FAVORITES_KEY = 'recipe-favorites';

export default class ShoppingListGenerator {
    constructor() {
        // Load all data needed: the planned meals and the full favorite recipe data
        this.mealPlan = getLocalStorage(MEAL_PLAN_KEY) || {};
        this.favorites = getLocalStorage(FAVORITES_KEY) || [];
        this.shoppingList = {}; // { ingredientName: { amount, unit, originalName } }
    }

    // Main algorithm: Combines ingredient quantities (Complex Logic/Algorithm)
    combineIngredients() {
        const plannedRecipeIds = new Set(Object.values(this.mealPlan).map(meal => meal.id));

        // 1. Filter the favorites list to only include recipes used in the plan
        const recipesToProcess = this.favorites.filter(recipe => plannedRecipeIds.has(recipe.id));

        if (recipesToProcess.length === 0) {
            qs('#list-message').textContent = 'No recipes were found in your meal plan.';
            return;
        }

        // 2. Iterate through all ingredients in all planned recipes
        recipesToProcess.forEach(recipe => {
            // Assume the recipe object contains an array of ingredients named 'extendedIngredients'
            if (recipe.extendedIngredients) {
                recipe.extendedIngredients.forEach(ingredient => {
                    // Create a normalized key (e.g., "flour" or "chicken breast")
                    const key = ingredient.name.toLowerCase().trim();

                    if (this.shoppingList[key]) {
                        // If ingredient already exists, COMBINE the amounts
                        const existing = this.shoppingList[key];

                        // NOTE: Combining is complex. For simplicity, we only combine if units match.
                        if (existing.unit === ingredient.unit) {
                            existing.amount += ingredient.amount;
                        } else {
                            // If units don't match, store it as a separate entry (append the unit to the key)
                            const complexKey = `${key} (${ingredient.unit})`;
                            this.shoppingList[complexKey] = {
                                amount: ingredient.amount,
                                unit: ingredient.unit,
                                originalName: ingredient.originalName || ingredient.name
                            };
                        }
                    } else {
                        // If ingredient is new, add it
                        this.shoppingList[key] = {
                            amount: ingredient.amount,
                            unit: ingredient.unit,
                            originalName: ingredient.originalName || ingredient.name
                        };
                    }
                });
            }
        });
    }

    // Renders the combined list to the HTML
    renderShoppingList() {
        const listEl = qs('#consolidated-list');
        listEl.innerHTML = ''; // Clear previous list

        if (Object.keys(this.shoppingList).length === 0) {
            return;
        }

        const items = Object.values(this.shoppingList).map(item => {
            // Format for display: "Amount Unit Name"
            const amount = item.amount % 1 !== 0 ? item.amount.toFixed(2) : item.amount;
            return `<li><input type="checkbox"> ${amount} ${item.unit} ${item.originalName}</li>`;
        }).join('');

        listEl.innerHTML = items;
        qs('#list-message').textContent = 'List generated successfully.';
    }

    // Renders the list of recipes used for clarity
    renderPlannedRecipes() {
        const listEl = qs('#planned-recipes-list');
        listEl.innerHTML = '';

        const recipes = Object.values(this.mealPlan).map(meal => `<li>${meal.title}</li>`).join('');

        listEl.innerHTML = recipes;
    }

    init() {
        this.combineIngredients();
        this.renderShoppingList();
        this.renderPlannedRecipes();
    }
}

// Instantiate and run the generator when the page loads
const shoppingList = new ShoppingListGenerator();
shoppingList.init();