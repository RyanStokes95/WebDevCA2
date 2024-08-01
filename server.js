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
const bcrypt = require('bcrypt');
const User = require('./schemas/User')
const Recipe = require('./schemas/Recipe')
const port = process.env.PORT;
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Server Connection and error handling
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
    console.error(`Error starting the server: ${error.message}`);
});

//Coonect to Mongo DB
connectDB();

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

// Login Route
app.post('/login', async (req, res) => {
    //username and password request body
    const { username, password } = req.body;
    //if username and hashed password match a DB record user is logged in
    try {
        //Check username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send("Invalid Username or Password");
        }

        //Check password using BCrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid Username or Password');
        }
        //Response of true if there is a match found
        res.json({ success: true });
    //Error handling
    } catch (error) {
        console.error("Error Cannot Login", error);
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
