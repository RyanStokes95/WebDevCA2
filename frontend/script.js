/*
script.js
Ryan Stokes
Created - 18/07/24
Last Modified - 01/08/24
*/

const usernameLocal = localStorage.getItem('username');
console.log("HEloo");
const registerBody = document.getElementById("registerBody");
//Local Session Storage - Username retrieval for DB queries
if (registerBody) {
    //Displays username and welcome message on dashboard
    if (usernameLocal) {
        document.getElementById("userWelcome").innerHTML = "Welcome " + usernameLocal + "!";
    }   
}

    console.log('DOMContentLoaded event fired');
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
                console.log("hello" + username);
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                //result variable assigned the JSON response
                console.log(response);
                //If result is success the user is logged in
                if (response.ok) {
                    console.log("Success");
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
    else{console.log("Sign in not found")}

    // Check if the registerForm element exists before adding event listener
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("Working")
        registerForm.addEventListener('submit', async (event) => {
            //Prevent default behaviour as data is posted
            event.preventDefault();

            //Retrieves data from form in key value pairs
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            //Data is sent via user-register route, try/catch for API, if/else for problems with the retrieved data
            try {
                const response = await fetch('/user-register', {
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




    const username = localStorage.getItem('username');

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener('click', () => {
        localStorage.clear(); // Added parentheses to actually clear the localStorage
        window.location.replace("index.html");
    });

    const minimiseRecipeButton = document.getElementById("minimiseRecipeButton");
    minimiseRecipeButton.style.opacity = "0.5"; // Hidden
    minimiseRecipeButton.style.pointerEvents = "none"; // Unclickable

    async function getRecipeCount() {
        try {
            const usernameLocal = localStorage.getItem('username');
            const response = await fetch(`/getRecipeCount/${encodeURIComponent(usernameLocal)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const recipeCountValue = String(await response.json());
            
            const recipeCount = document.getElementById("recipeCount");
            recipeCount.innerText = "You have logged " + recipeCountValue + " recipes!";
        } catch (error) {
            console.log(error, "Error fetching recipe count");
            alert("Something Went Wrong: " + error.message);
        }
    }

    getRecipeCount();

    async function getRecipes() {
        const myRecipes = document.getElementById("myRecipes");
        myRecipes.innerHTML = "";
        try {
            const usernameLocal = localStorage.getItem('username');
            console.log(usernameLocal);
            const response = await fetch(`/getRecipe/${encodeURIComponent(usernameLocal)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const recipes = await response.json();

            for (let i = 0; i < recipes.length; i++) {
                const ingredientsHeader = document.createElement("p");
                ingredientsHeader.innerText = "Ingredients";

                const stepsHeader = document.createElement("p");
                stepsHeader.innerText = "Steps";

                ingredientsHeader.className = "recipeHeader";
                stepsHeader.className = "recipeHeader";

                let ingredientsDiv = document.createElement("div");

                for (let j = 0; j < recipes[i].ingredients.length; j++) {
                    let ingredient = document.createElement("p");
                    ingredient.innerHTML = recipes[i].ingredients[j];
                    ingredientsDiv.appendChild(ingredient);
                }

                let stepsDiv = document.createElement("div");

                for (let k = 0; k < recipes[i].steps.length; k++) {
                    let step = document.createElement("p");
                    step.innerHTML = recipes[i].steps[k];
                    stepsDiv.appendChild(step);
                }

                const recipeDiv = document.createElement("div");
                recipeDiv.className = "recipe";
                recipeDiv.innerHTML = `
                    <div class="titleDelete">
                        <h3 class="recipeTitle">${recipes[i].title}</h3>
                        <button class="deleteButton">Delete</button>
                    </div>
                    <div class="recipeContent hidden">
                        <p class="recipeHeader">Description</p>
                        <p class="recipeDescription">${recipes[i].description}</p>
                        <p class="serves"><span class="recipeHeader">Serves:</span> ${recipes[i].serves}</p>
                    </div>
                `;

                const recipeContent = recipeDiv.querySelector(".recipeContent");
                const ingredientsFirstChild = ingredientsDiv.firstChild;
                ingredientsDiv.insertBefore(ingredientsHeader, ingredientsFirstChild);

                const stepsFirstChild = stepsDiv.firstChild;
                stepsDiv.insertBefore(stepsHeader, stepsFirstChild);

                recipeContent.appendChild(ingredientsDiv);
                recipeContent.appendChild(stepsDiv);

                const recipeTitle = recipeDiv.querySelector(".recipeTitle");
                recipeTitle.addEventListener("click", () => {
                    recipeContent.classList.toggle("hidden");
                    recipeContent.style.backgroundColor = "rgb(255, 255, 255)";
                });

                myRecipes.appendChild(recipeDiv);
            }

            deleteRecipes();

        } catch (error) {
            console.log(error, "Error fetching recipes");
        }
    }

    getRecipes();

    async function deleteRecipes() {
        const parentDivs = document.getElementsByClassName("titleDelete");

        for (let i = 0; i < parentDivs.length; i++) {
            const parentDiv = parentDivs[i];
            const deleteButton = parentDiv.querySelector(".deleteButton");

            deleteButton.addEventListener('click', async () => {
                const title = parentDiv.querySelector(".recipeTitle").textContent.trim();
                try {
                    const response = await fetch(`/deleteRecipe/${encodeURIComponent(title)}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const deletedRecipe = await response.json();
                    await getRecipes();
                } catch (error) {
                    alert("Could not delete Recipe: " + error.message);
                }
            });
        }
    }

    const createRecipeButton = document.getElementById("createRecipeButton");
    const createRecipeWrapper = document.getElementById("createRecipeFormWrapper");

    minimiseRecipeButton.addEventListener('click', () => {
        if (createRecipeWrapper) {
            createRecipeWrapper.style.opacity = "0.5";
            createRecipeWrapper.style.pointerEvents = "none";
        }
        createRecipeButton.style.opacity = "1";
        createRecipeButton.style.pointerEvents = "auto";
        minimiseRecipeButton.style.opacity = "0.5";
        minimiseRecipeButton.style.pointerEvents = "none";
        createRecipeWrapper.innerHTML = ""; 
    });

    createRecipeButton.addEventListener('click', () => {
        minimiseRecipeButton.style.opacity = "1"; 
        minimiseRecipeButton.style.pointerEvents = "auto";
        createRecipeButton.style.opacity = "0.5";
        createRecipeButton.style.pointerEvents = "none";
        createRecipeWrapper.style.opacity = "1";
        createRecipeWrapper.style.pointerEvents = "auto";
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
                const response = await fetch('/addRecipe', {
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
