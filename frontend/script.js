/*
script.js
Ryan Stokes
Created - 18/07/24
Last Modified - 07/08/24
*/

//Set username variable from local storage
const usernameLocal = localStorage.getItem('username');

const registerBody = document.getElementById("registerBody");
//Local Session Storage - Username retrieval for DB queries
if (registerBody) {
    //Displays username and welcome message on dashboard
    if (usernameLocal) {
        document.getElementById("userWelcome").innerHTML = "Welcome " + usernameLocal + "!";
    }   
}

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
            console.error(error);
            alert('An error occurred while logging in.');
        }
    });
}
else{
    console.log("Sign in not found")
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
                    alert('Could not register, please try again.');
                }
            //Error Handling
            } catch (error) {
                console.error(error);
                //Error alert for user
                alert('An error occurred while submitting the form.');
            }
        });
    }

const username = localStorage.getItem('username');

//Logout button, sends user back to landing page and clears local storage of username
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener('click', () => {
    localStorage.clear();
    window.location.replace("index.html");
});

//Function which retrieves users recipes
async function getRecipeCount() {
    try {
        //Username retrieved from local storage
        const usernameLocal = localStorage.getItem('username');
        //Username is sent and number of recipes is returned from user
        const response = await fetch(`/getRecipeCount/${encodeURIComponent(usernameLocal)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        //Numeric value parsed to string for display
        const recipeCountValue = String(await response.json());
        
        //Display to the user
        const recipeCount = document.getElementById("recipeCount");
        recipeCount.innerText = "You have logged " + recipeCountValue + " recipes!";
    //Error Handling
    } catch (error) {
        console.log(error, "Error fetching recipe count");
        alert("Something Went Wrong: " + error.message);
    }
}

getRecipeCount();

//Function which fetches and displays a users reipe
async function getRecipes() {
    //Recipe wrapper assigned to variable
    const myRecipes = document.getElementById("myRecipes");

    /*Recipes are cleared before new list is added, 
    prevents duplication of existing recipes after 
    each call of the function*/
    myRecipes.innerHTML = "";

    //Try/Catch for error handling
    try {
        //username retrieved form local storage
        const usernameLocal = localStorage.getItem('username');
        //fetch data using the getRecipes route, takes in username
        const response = await fetch(`/getRecipe/${encodeURIComponent(usernameLocal)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const recipes = await response.json();

        /*
        Two for loops nested within one for loop
        Outer loop iterates through the recipes retrieved in the getRecipes route
        during each iteration the two inner loops iterate through an individual recipes
        ingredients and steps and append them into a div to be displayed on the uiser dash
        */
        for (let i = 0; i < recipes.length; i++) {
            const ingredientsHeader = document.createElement("p");
            ingredientsHeader.innerText = "Ingredients";

            const stepsHeader = document.createElement("p");
            stepsHeader.innerText = "Steps";

            ingredientsHeader.className = "recipeHeader";
            stepsHeader.className = "recipeHeader";

            //Ingredients list creation for recipe
            let ingredientsDiv = document.createElement("div");

            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                let ingredient = document.createElement("p");
                ingredient.innerHTML = recipes[i].ingredients[j];
                ingredientsDiv.appendChild(ingredient);
            }

            //Steps list creation for recipe
            let stepsDiv = document.createElement("div");

            for (let k = 0; k < recipes[i].steps.length; k++) {
                let step = document.createElement("p");
                step.innerHTML = recipes[i].steps[k];
                stepsDiv.appendChild(step);
            }

            //Recipe element is created, ingedients and steps not added yet 
            const recipeDiv = document.createElement("div");
            recipeDiv.className = "recipe";
            //Below element is split into two divs as the recipe info (Dexcription, serves etc.) is minimised
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
            //Hidden recipe info assigned to variable
            const recipeContent = recipeDiv.querySelector(".recipeContent");
            
            //Add headers to the ingredients and steps divs as the first child
            const ingredientsFirstChild = ingredientsDiv.firstChild;
            ingredientsDiv.insertBefore(ingredientsHeader, ingredientsFirstChild);

            const stepsFirstChild = stepsDiv.firstChild;
            stepsDiv.insertBefore(stepsHeader, stepsFirstChild);

            //Add completed divs to the recipe content
            recipeContent.appendChild(ingredientsDiv);
            recipeContent.appendChild(stepsDiv);

            //Code to add event listener to recipe title show recipeContent when title is clicked on
            const recipeTitle = recipeDiv.querySelector(".recipeTitle");
            recipeTitle.addEventListener("click", () => {
                recipeContent.classList.toggle("hidden");
                recipeContent.style.backgroundColor = "rgb(255, 255, 255)";
            });
             //Adding completed recipe list to wrapper div
            myRecipes.appendChild(recipeDiv);
        } //Outer loop ends here

        //Called to add functionality to newly created button
        deleteRecipes();
        //Error Handling
    } catch (error) {
        alert("Could not fetch recipes", error.message);
    }
}

//Call getRecipes
getRecipes();

/*
function to delete a recipe when the individual button attatched to the recipe is clicked,
function is called after a new recipe is added
*/
async function deleteRecipes() {
    const parentDivs = document.getElementsByClassName("titleDelete");

    //Loops throught all recipes adding the functionality of the delete button
    for (let i = 0; i < parentDivs.length; i++) {
        const parentDiv = parentDivs[i];
        const deleteButton = parentDiv.querySelector(".deleteButton");

        deleteButton.addEventListener('click', async () => {
            //Deletes Div containing recipe
            const title = parentDiv.querySelector(".recipeTitle").textContent.trim();
            try {
                //Deletes the recipe from the database
                const response = await fetch(`/deleteRecipe/${encodeURIComponent(title)}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                //Response - Currently unused, future error hadnling could need
                const deletedRecipe = await response.json();
                //Retrieve new recipes and count for the user dash
                await getRecipes();
                await getRecipeCount();
                //Error Handling
            } catch (error) {
                alert("Could not delete Recipe: " + error.message);
            }
        });
    }
}

const createRecipeButton = document.getElementById("createRecipeButton");
const createRecipeWrapper = document.getElementById("createRecipeFormWrapper");
//Close recipe creation button is de-activated by default
const minimiseRecipeButton = document.getElementById("minimiseRecipeButton");
minimiseRecipeButton.style.opacity = "0.5";
minimiseRecipeButton.style.pointerEvents = "none"; 

//Code to change create recipe and close buttons appearal on user dash
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
    //Div to be opened when create recipe is clicked
    createRecipeWrapper.innerHTML = `
        <div id="createRecipeForm">
            <label for="title">Title (Must Be Unique)</label>
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
        //Validation for form
        if (!title) {
            alert("Please enter a title");
            return;
        }
        if (!description) {
            alert("Please enter a description");
            return;
        }
        if (!serves || isNaN(serves)) {
            alert("Please enter a valid number for serves");
            return;
        }
        //Load the items form the display div to an array for sending to the database
        const ingredientsWrapper = document.getElementById('ingredientsWrapper');
        const ingredients = Array.from(ingredientsWrapper.children).map(child => child.textContent);
        //Load the items form the display div to an array for sending to the database
        const stepsWrapper = document.getElementById('stepsWrapper');
        const steps = Array.from(stepsWrapper.children).map(child => child.textContent);

        //Username to be added to the recipe
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
        //Sends recipeData to server route which writes the recipe to the database
        try {
            const response = await fetch('/addRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
                
            });
    
            if (response.ok) {
                alert('Recipe added successfully!');
            } else {
                alert('Failed to add recipe. Please check inputs');
            }
            //Error Handling
        } catch (error) {
            alert("Could not connect to MKP, please try again", error.message);
        }

        //Code to delete the ingredients and steps visual list on clicking add recipe
        const ingredientElement = document.getElementById("ingredientsWrapper");
        const stepsElement = document.getElementById("stepsWrapper")
        
        //deletion of the temporary divs for displaying added steps and ingredients
        ingredientElement.style.visibility = "hidden";
        ingredientElement.style.height = "0px";
        stepsElement.style.visibility = "hidden";
        stepsElement.style.height = "0px";

        //Called to load the new list of recipes after a new one has been added
        getRecipes();

        //Clears all recipe fields on clicking add recipe
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.value = "";
        });

    });
});


    
