require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors =  require('cors');

const connectDB = require('./dbconfig');
connectDB();

const User = require('./User')

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
    console.error(`Error starting the server: ${error.message}`);
});

app.post('/user-register', async (req, res) => {
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
        country} = req.body;

        const formData = new User({
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
        });

        try {
            formData.save();
            res.status(200).send("User Submitted Successfully");
        } catch (error) {
            res.status(500).send("Failed to Add User");
        }
});