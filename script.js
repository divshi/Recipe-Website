let recipes = [];
let visibleRecipes = 6; // Start with 6 visible recipes

// Initialize recipes from localStorage
function loadRecipesFromStorage() {
  const storedRecipes = localStorage.getItem("recipes");
  if (storedRecipes) {
    recipes = JSON.parse(storedRecipes);
  }
}

// Save recipes to localStorage
function saveRecipesToStorage() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

// Fetch initial recipes (if using a JSON file)
fetch("recipes.json")
  .then((response) => response.json())
  .then((data) => {
    if (!recipes.length) {
      recipes = data; // Only load from JSON if localStorage is empty
      saveRecipesToStorage();
    }
    displayRecipes();
  })
  .catch((error) => console.error("Error fetching recipes:", error));

// Display recipes dynamically
function displayRecipes(filteredRecipes = recipes) {
  const container = document.getElementById("recipes-container");
  container.innerHTML = "";
  const recipesToShow = filteredRecipes.slice(0, visibleRecipes);

  recipesToShow.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <h3>${recipe.name}</h3>
    `;
    card.addEventListener("click", () => openRecipe(recipe));
    container.appendChild(card);
  });

  const moreRecipesBtn = document.getElementById("more-recipes-btn");
  if (filteredRecipes.length > visibleRecipes) {
    moreRecipesBtn.style.display = "block";
    moreRecipesBtn.innerText = "More Recipes";
  } else {
    moreRecipesBtn.style.display = "none";
  }
}

// Show detailed recipe in a modal
function openRecipe(recipe) {
  const modal = document.getElementById("recipe-modal");
  const modalContent = document.getElementById("modal-recipe-content");
  modalContent.innerHTML = `
    <h2>${recipe.name}</h2>
    <img src="${recipe.image}" alt="${recipe.name}">
    <h3>Ingredients</h3>
    <p>${recipe.ingredients}</p>
    <h3>Steps</h3>
    <p>${recipe.steps}</p>
  `;
  modal.style.display = "flex";
}

// Close modal functionality
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("recipe-modal").style.display = "none";
});

// Close modal on outside click
window.addEventListener("click", (event) => {
  const modal = document.getElementById("recipe-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Toggle visibility of recipes and change button to 'Back' when clicked
document.getElementById("more-recipes-btn").addEventListener("click", () => {
  const moreRecipesBtn = document.getElementById("more-recipes-btn");

  // Toggle between showing all and limited recipes
  if (moreRecipesBtn.innerText === "More Recipes") {
    visibleRecipes = recipes.length; // Show all recipes
    moreRecipesBtn.innerText = "Back"; // Change button text
  } else {
    visibleRecipes = 6; // Show only 6 recipes
    moreRecipesBtn.innerText = "More Recipes"; // Change button text back
  }
  displayRecipes();
});

// **🔍 Search Functionality with Dropdown**
const searchBar = document.getElementById("search-bar");
const dropdown = document.getElementById("search-dropdown");

searchBar.addEventListener("input", function () {
  const query = searchBar.value.toLowerCase();
  dropdown.innerHTML = "";

  if (query) {
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(query)
    );

    if (filteredRecipes.length > 0) {
      dropdown.style.display = "block";
      filteredRecipes.forEach((recipe) => {
        const div = document.createElement("div");
        div.textContent = recipe.name;
        div.onclick = () => {
          openRecipe(recipe);
          dropdown.style.display = "none"; // Hide dropdown after selection
        };
        dropdown.appendChild(div);
      });
    } else {
      dropdown.style.display = "none";
    }
  } else {
    dropdown.style.display = "none";
  }
});

// Hide dropdown when clicking outside
window.addEventListener("click", (event) => {
  if (event.target !== searchBar) {
    dropdown.style.display = "none";
  }
});

// Convert uploaded image to Base64
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Add a new recipe
document.getElementById("recipe-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("recipe-name").value;
  const ingredients = document.getElementById("ingredients").value;
  const steps = document.getElementById("steps").value;
  const fileInput = document.getElementById("recipe-image");

  let image = "image/default.jpg"; // Default image
  if (fileInput.files.length > 0) {
    try {
      image = await convertToBase64(fileInput.files[0]);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  }

  const newRecipe = { name, ingredients, steps, image };
  recipes.push(newRecipe);
  saveRecipesToStorage(); // Save the updated recipes to localStorage
  displayRecipes();
  e.target.reset();
});

// Load recipes on page load
document.addEventListener("DOMContentLoaded", () => {
  loadRecipesFromStorage();
  displayRecipes();
});
