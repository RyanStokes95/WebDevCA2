require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors =  require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./User')

const connectDB = require('./dbconfig');
connectDB();

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

        try {
            const salt = await bcrypt.genSalt(10);
            
            const hashedPassword = await bcrypt.hash(password, salt);
                
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
    
            await formData.save();
            res.status(200).send("User Submitted Successfully");
        } catch (error) {
            res.status(500).send("Failed to Add User");
        }
    });

app.post('/login', async (res, req) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username })
})