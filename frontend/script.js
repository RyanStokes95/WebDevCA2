/*
script.js
Ryan Stokes
Created - 18/07/24
Last Modified - 01/08/24
*/

//Local Session Storage
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById("userWelcome").innerHTML = "Welcome " + username + "!";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if the signInForm element exists before adding event listener
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            username = data.username;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    // Login successful, redirect to the dashboard or another page
                    window.location.replace("userDashboard.html");
                    localStorage.setItem('username', username);
                } else {
                    alert('Login failed: ' + result.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred while logging in.');
            }
        });
    }

    // Check if the registerForm element exists before adding event listener
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission behavior

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3000/user-register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('Form submitted successfully!');
                    window.location.replace("index.html");
                } else {
                    alert('Failed to submit form.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting the form.');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener('click', () => {
        localStorage.clear;
        window.location.replace("index.html");
    })

    const createRecipeButton = document.getElementById("createRecipeButton");
    const createRecipeWrapper = document.getElementById("createRecipeFormWrapper");

    createRecipeButton.addEventListener('click', () => {
        createRecipeWrapper.innerHTML = `
            <div id="createRecipeForm">
                <label for="title">Title</label>
                <input type="text" id="title" name="title">
        
                <label for="description">Description</label>
                <textarea type="text" id="description" name="description" rows="4" cols="50"></textarea>
        
                <label for="serves">Serves</label>
                <input type="number" id="serves" name="serves">
        
                <label for="ingredients">Ingredients</label>
                <input type="text" id="ingredients" name="ingredients">
                <button id="addIngredientButton">Add</button>
                <div id="ingredientsWrapper"></div>
        
                <label for="steps">Steps</label>
                <input type="text" id="steps" name="steps">
                <button id="addStepButton">Add</button>
                <div id="stepsWrapper"></div>
        
                <button id="addRecipe">Add Recipe</button>
            </div>
        `;
        
        const addStepButton = document.getElementById("addStepButton");
        const stepsWrapper = document.getElementById("stepsWrapper");
        let i = 1;

        addStepButton.addEventListener('click', () => {
            const step = document.getElementById("steps").value;

            if (step.trim()) {
                stepsWrapper.style.visibility = "visible";
                const stepElement = document.createElement("div");
                stepElement.textContent = i + ". " + step;
                stepsWrapper.appendChild(stepElement);
                document.getElementById("steps").value = "";
                i = i + 1;
            } else {
                alert("Please enter a step.");
            }

        });

        const addIngredientButton = document.getElementById("addIngredientButton");
        const ingredientsWrapper = document.getElementById("ingredientsWrapper");
    
        addIngredientButton.addEventListener('click', () => {
            const ingredient = document.getElementById("ingredients").value;
    
            if (ingredient.trim()) {
                ingredientsWrapper.style.visibility = "visible";
                const ingredientElement = document.createElement("div");
                ingredientElement.textContent = ingredient;
                ingredientsWrapper.appendChild(ingredientElement);
                document.getElementById("ingredients").value = "";
            } else {
                alert("Please enter an ingredient.");
            }
        });
        document.getElementById('addRecipe').addEventListener('click', async () => {
            //Retrieving data from recipe div
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const serves = document.getElementById('serves').value;
            const ingredientsWrapper = document.getElementById('ingredientsWrapper');
            const ingredients = Array.from(ingredientsWrapper.children).map(child => child.textContent);
            const stepsWrapper = document.getElementById('stepsWrapper');
            const steps = Array.from(stepsWrapper.children).map(child => child.textContent);
            const username = localStorage.getItem('username');
        
            //JSON object cretaed from data
            const recipeData = {
                title: title,
                description: description,
                serves: serves,
                ingredients: ingredients,
                steps: steps,
                username: username
            };

            console.log(recipeData);

            try {
                const response = await fetch('http://localhost:3000/addRecipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(recipeData),
                    
                });
        
                if (response.ok) {
                    console.log('Recipe added successfully!');
                } else {
                    console.error('Failed to add recipe.');
                }
            } catch (error) {
                console.error('Error:', error);
            }

            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = "";
            });

        });
    });//dont go beyond
});