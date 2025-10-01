# BYU-Pathway Worldwide Online
## WDD 330 - Web Frontend Development II

### 🍽️ Recipe & Meal Planner - Final Project

This repository contains the completed final web application project for WDD 330: **The Recipe & Meal Planner**.

The application is built around the goal of solving common mealtime problems by allowing users to:
* Search for recipes by keywords and ingredients.
* Save favorite recipes and manage a personal profile.
* Create a weekly meal plan that automatically generates a shopping list.

---

### Prerequisites

- You must have Node installed to run the following commands.
[WDD 330 Setup Environment](https://byui-cse.github.io/wdd330-ww-course/intro/)

### API Requirements

This project relies on external data. To run the application locally, you must obtain and configure the following API keys:
1.  **Spoonacular API:** For all recipe search, ingredient, and instruction data.
2.  **Edamam Nutrition API:** For detailed nutritional analysis.

**Configuration:** Place your keys in a local **`.env`** file at the project root:
```env
VITE_SPOONACULAR_API_KEY="YOUR_SPOONACULAR_KEY_HERE"
VITE_EDAMAM_APP_ID="YOUR_EDAMAM_APP_ID_HERE"
VITE_EDAMAM_APP_KEY="YOUR_EDAMAM_APP_KEY_HERE"