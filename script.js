let recipes = [];
let visibleRecipes = 6;  // Start with 6 visible recipes

// Fetch recipes from JSON file
fetch('recipes.json')
  .then(response => response.json())
  .then(data => {
    recipes = data;
    displayRecipes();
  })
  .catch(error => console.error('Error fetching recipes:', error));

// Display recipes dynamically
function displayRecipes(filteredRecipes = recipes) {
  const container = document.getElementById('recipes-container');
  container.innerHTML = '';
  const recipesToShow = filteredRecipes.slice(0, visibleRecipes);

  recipesToShow.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <h3>${recipe.name}</h3>
    `;
    card.addEventListener('click', () => openRecipe(recipe));
    container.appendChild(card);
  });

  const moreRecipesBtn = document.getElementById('more-recipes-btn');
  if (filteredRecipes.length > visibleRecipes) {
    moreRecipesBtn.style.display = 'block';
    moreRecipesBtn.innerText = 'More Recipes';
  } else {
    moreRecipesBtn.style.display = 'none';
  }
}

// Show detailed recipe in a modal
function openRecipe(recipe) {
  const modal = document.getElementById('recipe-modal');
  const modalContent = document.getElementById('modal-recipe-content');
  modalContent.innerHTML = `
    <h2>${recipe.name}</h2>
    <img src="${recipe.image}" alt="${recipe.name}">
    <h3>Ingredients</h3>
    <p>${recipe.ingredients}</p>
    <h3>Steps</h3>
    <p>${recipe.steps}</p>
  `;
  modal.style.display = 'flex';
}

// Close modal functionality
document.getElementById('close-modal').addEventListener('click', () => {
  const modal = document.getElementById('recipe-modal');
  modal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (event) => {
  const modal = document.getElementById('recipe-modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Toggle visibility of recipes and change button to 'Back' when clicked
document.getElementById('more-recipes-btn').addEventListener('click', () => {
    const moreRecipesBtn = document.getElementById('more-recipes-btn');
    
    // If "More Recipes" button is clicked, show all recipes and change button to "Back"
    if (moreRecipesBtn.innerText === 'More Recipes') {
      visibleRecipes = recipes.length;  // Show all recipes
      moreRecipesBtn.innerText = 'Back';  // Change button text
    } else {
      visibleRecipes = 6;  // Show only 6 recipes
      moreRecipesBtn.innerText = 'More Recipes';  // Change button text back
    }
    
    displayRecipes();
  });
  

// Search recipes by name
document.getElementById('search-bar').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(query)
  );
  displayRecipes(filteredRecipes);
});

// Add a new recipe
document.getElementById('recipe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('recipe-name').value;
  const ingredients = document.getElementById('ingredients').value;
  const steps = document.getElementById('steps').value;
  const image = 'image/default.jpg';  // Use a default image for now
  recipes.push({ name, ingredients, steps, image });
  displayRecipes();
  e.target.reset();
});
