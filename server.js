/*
server.js
Ryan Stokes
Created - 18/07/24
Last Modified - 01/08/24
*/

//imports and dependencies
require('dotenv').config();
const { connectDB } = require('./dbconfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors =  require('cors');
const bcrypt = require('bcryptjs');
const User = require('./schemas/User')
const Recipe = require('./schemas/Recipe')
const path = require("path");
const port = process.env.PORT;
const app = express();

//Middleware
const corsOptions = {
    origin: 'https://mykitchenpal-cd208d106a16.herokuapp.com',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});


//Coonect to Mongo DB
connectDB();

//Route to get recipes that belong to the user
app.get('/getRecipe/:usernameLocal', async (req, res) => {
    //Request Parameter
    const { usernameLocal } = req.params;
    //Await the results form the Mongo DB
    const recipes = await Recipe.find({ username: usernameLocal });
    //Respond with the recipes in JSON format
    res.status(200).json(recipes);
})

app.get('/getRecipeCount/:usernameLocal', async (req, res) => {
    const { usernameLocal } = req.params;
    const recipeCount = await Recipe.countDocuments({ username: usernameLocal });
    res.status(200).json(recipeCount);
})

app.delete('/deleteRecipe/:title', async (req, res) => {
    const { title } = req.params;
    const deletedRecipe = await Recipe.deleteOne({ title: title });
    res.status(200).json(`${ title }` + " has been successfully deleted")
})


//User Register Route
app.post('/user-register', async (req, res) => {
    //Request Body - User Details
    const {

        username, 
        password, 
        firstName, 
        secondName, 
        age, 
        email, 
        street, 
        town, 
        city, 
        country

    } = req.body;

        try {
            //BCrypt used to hash and salt password before DB insertion
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            //Data used to create new user schema object
            const formData = new User({

                username,
                password: hashedPassword,
                firstName,
                secondName,
                age,
                email,
                street,
                town,
                city,
                country

            });
            
            //Success if data is stored in mongoDB
            await formData.save();
            res.status(200).send("User Submitted Successfully");
        } catch (error) {
            //Error message if user is not added correctly
            res.status(500).send("Failed to Add User");
        }
    });

    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password });
    
        try {
            const user = await User.findOne({ username });
            if (!user) {
                console.log('User not found');
                return res.status(401).send("Invalid Username or Password");
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch);
    
            if (!isMatch) {
                console.log('Password does not match');
                return res.status(401).send('Invalid Username or Password');
            }
    
            res.json({ success: true });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).send("Server Error");
        }
    });

app.post('/addRecipe', async (req, res) => {
    const { 

        title,
        description,
        serves,
        ingredients,
        steps,
        username

     } = req.body;

     try {
        const formData = new Recipe ({

            title,
            description,
            serves,
            ingredients,
            steps,
            username

        })
        await formData.save();
        res.status(200).send("Recipe Submitted Successfully");
     } catch (error) {
        res.status(500).send("Failed to add recipe")
     }
})

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

//Server Connection and error handling
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
    console.error(`Error starting the server: ${error.message}`);
});

