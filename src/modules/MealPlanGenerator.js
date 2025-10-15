// src/modules/MealPlanGenerator.mjs

// --- 1. UTILITY FUNCTIONS (Consolidated to avoid path errors) ---
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function qs(selector) {
    return document.querySelector(selector);
}

// --- 2. MEAL PLANNER LOGIC ---

const MEAL_PLAN_KEY = 'current-meal-plan';
const FAVORITES_KEY = 'recipe-favorites';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default class MealPlanGenerator {
    constructor() {
        this.today = new Date();
        // Start date of the currently displayed week (Sunday)
        this.currentWeekStart = this.getWeekStart(this.today);
        // Load existing data
        this.favorites = getLocalStorage(FAVORITES_KEY) || [];
        this.plan = getLocalStorage(MEAL_PLAN_KEY) || {};
    }

    // Utility function to get the Sunday of the current week
    getWeekStart(date) {
        const day = date.getDay(); // 0 for Sunday
        const diff = date.getDate() - day;
        const sunday = new Date(date.setDate(diff));
        sunday.setHours(0, 0, 0, 0);
        return sunday;
    }

    // Renders the 7-day calendar structure
    renderCalendar() {
        const calendarEl = qs('#meal-calendar');
        calendarEl.innerHTML = ''; // Clear existing content

        const currentDay = new Date(this.currentWeekStart);

        for (let i = 0; i < 7; i++) {
            const dateString = currentDay.toISOString().split('T')[0];

            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.dataset.date = dateString;

            // Check if a recipe is planned for this date
            const plannedRecipe = this.plan[dateString];

            let mealSlotContent = '';
            if (plannedRecipe) {
                // Render the saved recipe if it exists
                mealSlotContent = `<div class="meal-recipe-item" data-id="${plannedRecipe.id}">${plannedRecipe.title}</div>`;
            } else {
                // Render the placeholder if no recipe is saved
                mealSlotContent = `<p class="placeholder">Drag recipe here</p>`;
            }

            dayCard.innerHTML = `
                <div class="day-header">${DAYS[i]}</div>
                <div class="date-header">${currentDay.getMonth() + 1}/${currentDay.getDate()}</div>
                <div class="meal-slot" data-date="${dateString}" id="slot-${i}">
                    ${mealSlotContent}
                </div>
            `;
            calendarEl.appendChild(dayCard);

            currentDay.setDate(currentDay.getDate() + 1);
        }

        // Update week display
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        qs('#week-display').textContent = `Week of ${this.currentWeekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    }

    // Renders the list of favorite recipes (from LocalStorage)
    renderFavoritesList() {
        const listEl = qs('#favorites-list');
        if (!listEl) return;

        if (this.favorites.length === 0) {
            listEl.innerHTML = '<p>No favorites saved yet. Add some to get started!</p>';
            return;
        }

        const listItems = this.favorites.map(recipe => `
            <li class="meal-recipe-item" draggable="true" data-id="${recipe.id}">
                ${recipe.title}
            </li>
        `).join('');

        listEl.innerHTML = listItems;
    }

    // --- DRAG AND DROP METHODS (Events Requirement) ---

    attachDragAndDrop() {
        // 1. Make the favorites list items draggable
        const recipeItems = document.querySelectorAll('#favorites-list .meal-recipe-item');
        recipeItems.forEach(item => {
            item.addEventListener('dragstart', this.handleDragStart.bind(this));
        });

        // 2. Make the meal slots droppable
        const mealSlots = document.querySelectorAll('.meal-slot');
        mealSlots.forEach(slot => {
            slot.addEventListener('dragover', this.handleDragOver);
            slot.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragStart(e) {
        // Store the recipe ID being dragged
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.target.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const recipeId = e.dataTransfer.getData('text/plain');
        e.dataTransfer.clearData();

        const mealSlot = e.currentTarget;
        const dateString = mealSlot.dataset.date;

        const recipe = this.favorites.find(r => r.id == recipeId);

        if (recipe) {
            // Remove any existing recipe or placeholder
            mealSlot.innerHTML = '';

            // Create a new element to display the dropped recipe
            const droppedItem = document.createElement('div');
            droppedItem.className = 'meal-recipe-item';
            droppedItem.textContent = recipe.title;

            mealSlot.appendChild(droppedItem);

            // Save the meal to the plan object (Persistence Requirement)
            this.plan[dateString] = {
                id: recipe.id,
                title: recipe.title,
            };

            setLocalStorage(MEAL_PLAN_KEY, this.plan);
        }
    }

    // Attaches event listeners for week navigation (Future feature)
    attachListeners() {
        // Future: Add logic for #prev-week and #next-week buttons here
    }

    // The main entry point
    init() {
        this.renderCalendar();
        this.renderFavoritesList();
        this.attachListeners();
        this.attachDragAndDrop();
    }
}

// Instantiate and run the generator when the page loads
const planner = new MealPlanGenerator();
planner.init();