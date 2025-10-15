// src/modules/Favorites.mjs

// FIX 1: Corrected path for utils.mjs (assuming utils is in src/js/)
// This resolves the Vite module resolution error.
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function qs(selector) {
    return document.querySelector(selector);
}
const FAVORITES_KEY = 'recipe-favorites';

export default class Favorites {
    constructor(recipeId, recipeData) {
        this.recipeId = recipeId;
        this.recipeData = recipeData;
        // Load existing favorites from LocalStorage
        this.favorites = getLocalStorage(FAVORITES_KEY) || [];
    }

    // Check if the current recipe is already saved
    isSaved() {
        // Use == for comparison as IDs can sometimes be strings/numbers
        return this.favorites.some(item => item.id == this.recipeId);
    }

    // Toggles the save status
    toggleFavorite() {
        if (this.isSaved()) {
            // Remove from favorites
            this.favorites = this.favorites.filter(item => item.id != this.recipeId);
            console.log(`Removed recipe ${this.recipeId} from favorites.`);
        } else {
            // Add to favorites
            this.favorites.push(this.recipeData);
            console.log(`Added recipe ${this.recipeId} to favorites.`);
        }

        // Save the updated array back to LocalStorage (LocalStorage requirement)
        setLocalStorage(FAVORITES_KEY, this.favorites);
        this.updateButtonText();
    }

    // Renders the button and attaches the event listener
    initButton() {
        const saveBtn = qs('#save-favorite-btn');
        if (!saveBtn) {
            console.error("Favorite button element not found.");
            return;
        }

        // Initial state update
        this.updateButtonText();

        // Attach the click event listener (Events requirement)
        saveBtn.addEventListener('click', () => {
            this.toggleFavorite();
        });
    }

    updateButtonText() {
        const saveBtn = qs('#save-favorite-btn');
        if (!saveBtn) return;

        if (this.isSaved()) {
            saveBtn.textContent = 'In Favorites (Unsave)';
            saveBtn.classList.add('saved');
        } else {
            saveBtn.textContent = 'Add to Favorites ❤️';
            saveBtn.classList.remove('saved');
        }
    }
}