/*
script.js
Ryan Stokes
Created - 18/07/24
Last Modified - 01/08/24
*/

//Local Session Storage - Username retrieval for DB queries
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    //Displays username and welcome message on dashboard
    if (username) {
        document.getElementById("userWelcome").innerHTML = "Welcome " + username + "!";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if the signInForm element exists before adding event listener
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async (event) => {

            //Prevent default behaviour as data is posted
            event.preventDefault();

            //Retrieves data from form in key value pairs
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            //username to be added to local storage
            let username = data.username;

            //Data is sent via login route, try/catch for API, if/else for problems with the retrieved data
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                //result variable assigned the JSON response
                const result = await response.json();

                //If result is success the user is logged in
                if (result.success) {
                    //Upon login user dash is opened and username is sent to local storage
                    window.location.replace("userDashboard.html");
                    localStorage.setItem('username', username);
                } else {
                    //Alert to user if login fails
                    alert('Login failed: ' + result.message);
                }
                //Error Handling
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
            //Prevent default behaviour as data is posted
            event.preventDefault();

            //Retrieves data from form in key value pairs
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            //Data is sent via user-register route, try/catch for API, if/else for problems with the retrieved data
            try {
                const response = await fetch('http://localhost:3000/user-register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                //If user added they are given a message and re-directed to the landing page
                if (response.ok) {
                    alert('Registration Successfull');
                    window.location.replace("index.html");
                } else {
                    alert('Failed to submit form.');
                }
                //Error Handling
            } catch (error) {
                console.error('Error:', error);
                //Error alert for user
                alert('An error occurred while submitting the form.');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {

    const username = localStorage.getItem('username');

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener('click', () => {
        localStorage.clear;
        window.location.replace("index.html");
    })

    const minimiseRecipeButton = document.getElementById("minimiseRecipeButton");
    minimiseRecipeButton.style.visibility = "hidden";

    async function getRecipeCount(){
        try {
            response = await fetch(`http://localhost:3000/getRecipeCount/${encodeURIComponent(username)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const recipeCountValue = String(await response.json());
                
                const recipeCount= document.getElementById("recipeCount");

                recipeCount.innerText = "You have logged " + recipeCountValue + " recipes!";
        } catch (error) {
            console.log(error, "Error fetching recipe count")
            alert("Something Went Wrong: " + error.message)
        }
    }

    getRecipeCount()

    async function getRecipes(){
        const myRecipes = document.getElementById("myRecipes")
        myRecipes.innerHTML = "";
        try {
            const response = await fetch(`http://localhost:3000/getRecipe/${encodeURIComponent(username)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const recipes = await response.json();

                    for (let i = 0; i < recipes.length; i++) {

                        const ingredientsHeader = document.createElement("p")
                        ingredientsHeader.innerText = "Ingredients";

                        const stepsHeader = document.createElement("p")
                        stepsHeader.innerText = "Steps";

                        ingredientsHeader.className = "recipeHeader"
                        stepsHeader.className = "recipeHeader"

                        let ingredientsDiv = document.createElement("div")

                        for (let j = 0; j < recipes[i].ingredients.length; j++) {
                            
                            let ingredient = document.createElement("p")
                            ingredient.innerHTML = recipes[i].ingredients[j]
                            ingredientsDiv.appendChild(ingredient)
                            
                        }

                        let stepsDiv = document.createElement("div")

                        for (let k = 0; k < recipes[i].steps.length; k++) {
                            
                            let steps = document.createElement("p")
                            steps.innerHTML = recipes[i].steps[k]
                            stepsDiv.appendChild(steps)
                            
                        }

                    const recipeDiv = document.createElement("div")
                    recipeDiv.className = "recipe"
                    recipeDiv.innerHTML = `
                            <h3 class="recipeTitle">${recipes[i].title}</h3>
                            <div class="recipeContent hidden">
                                <p class="recipeHeader">Description</p>
                                <p class="recipeDescription">${recipes[i].description}</p>
                                <p class="serves"><span class="recipeHeader">Serves:</span> ${recipes[i].serves}</p>
                            </div>
                    `

                    const recipeContent = recipeDiv.querySelector(".recipeContent");

                    const ingredientsFirstChild = ingredientsDiv.firstChild;
                    ingredientsDiv.insertBefore(ingredientsHeader, ingredientsFirstChild)
                    
                    const StepsFirstChild = stepsDiv.firstChild;
                    stepsDiv.insertBefore(stepsHeader, StepsFirstChild)

                    recipeContent.appendChild(ingredientsDiv);
                    recipeContent.appendChild(stepsDiv);

                    const recipeTitle = recipeDiv.querySelector(".recipeTitle");
                    recipeTitle.addEventListener("click", () => {
                        recipeContent.classList.toggle("hidden");
                        recipeContent.style.backgroundColor = "rgb(255, 255, 255)";
                    });

                    myRecipes.appendChild(recipeDiv)
                        
                    }

                    

        
        } catch (error) {
            console.log(error, "Error fetching recipes")
        };

        
    }

    getRecipes();

    const createRecipeButton = document.getElementById("createRecipeButton");
    const createRecipeWrapper = document.getElementById("createRecipeFormWrapper");

    minimiseRecipeButton.addEventListener('click', () => {
        if (createRecipeWrapper) {
            createRecipeWrapper.style.visibility = "hidden"
        }
        createRecipeButton.style.visibility = "visible";
        minimiseRecipeButton.style.visibility = "hidden";
        createRecipeWrapper.innerHTML = "";
    });

    createRecipeButton.addEventListener('click', () => {
        minimiseRecipeButton.style.visibility = "visible";
        createRecipeButton.style.visibility = "hidden";
        createRecipeWrapper.style.visibility = "visible";
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

            const ingredientElement = document.getElementById("ingredientsWrapper");
            const stepsElement = document.getElementById("stepsWrapper")

            ingredientElement.style.visibility = "hidden";
            ingredientElement.style.height = "0px";
            stepsElement.style.visibility = "hidden";
            stepsElement.style.height = "0px";

            getRecipes();

            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = "";
            });

        });
    });//Create Recipe Button Click End
});