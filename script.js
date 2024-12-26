// Initial Preloaded Recipes
const initialRecipes = [
    {
        name: 'Butter Chicken',
        ingredients: 'Chicken, Butter, Cream, Spices',
        steps: '1. Marinate chicken. 2. Cook with butter and spices. 3. Add cream and simmer.',
        image: 'https://example.com/butter-chicken.jpg', // Replace with actual image URL
    },
    {
        name: 'Paneer Tikka',
        ingredients: 'Paneer, Yogurt, Spices',
        steps: '1. Marinate paneer. 2. Grill with spices.',
        image: 'https://example.com/paneer-tikka.jpg', // Replace with actual image URL
    },
    {
        name: 'Vegetable Biryani',
        ingredients: 'Rice, Vegetables, Spices',
        steps: '1. Cook rice. 2. Stir-fry vegetables with spices. 3. Mix and cook together.',
        image: 'https://example.com/vegetable-biryani.jpg', // Replace with actual image URL
    }
];

// Load recipes from localStorage if any, otherwise use initial ones
let recipes = JSON.parse(localStorage.getItem('recipes')) || initialRecipes;

// Function to display all recipes
function displayRecipes(recipesToShow) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = '';
    
    recipesToShow.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
        `;
        
        recipeCard.onclick = () => showRecipeDetails(recipe);
        recipesContainer.appendChild(recipeCard);
    });
}

// Display recipe details on a new page
function showRecipeDetails(recipe) {
    const recipeDetailsPage = document.getElementById('recipe-details-page');
    const recipeDetails = document.getElementById('recipe-details');
    
    recipeDetails.innerHTML = `
        <h2>${recipe.name}</h2>
        <img src="${recipe.image}" alt="${recipe.name}">
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Preparation Steps:</strong> ${recipe.steps}</p>
    `;
    
    recipeDetailsPage.style.display = 'flex';
}

// Go back to the main page
document.getElementById('back-button').addEventListener('click', () => {
    document.getElementById('recipe-details-page').style.display = 'none';
});

// Add new recipe functionality
document.getElementById('recipe-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const recipeName = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('ingredients').value;
    const steps = document.getElementById('steps').value;
    const image = document.getElementById('recipe-image').files[0];

    if (recipeName && ingredients && steps && image) {
        const reader = new FileReader();
        
        reader.onloadend = function () {
            const newRecipe = {
                name: recipeName,
                ingredients: ingredients,
                steps: steps,
                image: reader.result,
            };

            recipes.push(newRecipe);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            displayRecipes(recipes);
        };

        reader.readAsDataURL(image);
    } else {
        alert('Please fill out all fields.');
    }
});

// Search functionality
document.getElementById('search-bar').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) || 
        recipe.ingredients.toLowerCase().includes(query)
    );
    displayRecipes(filteredRecipes);
});

// Initially display all recipes
displayRecipes(recipes);
