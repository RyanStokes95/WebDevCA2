require('dotenv').config();
const { connectDB, store } = require('./dbconfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors =  require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./User')
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
    console.error(`Error starting the server: ${error.message}`);
});

connectDB();

store.on('error', function(error) {
    console.error('Session Store Error:', error);
});

app.use(session({
    secret: process.env.SESSION_SECRET_KEY, 
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false }
  }));


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

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send("Invalid Username or Password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid Username or Password');
        }

        // Set user session
        req.session.user = {
            id: user._id,
            username: user.username
        };

        res.json({ success: true });
    } catch (error) {
        console.error("Error Cannot Login", error);
        res.status(500).send("Server Error");
    }
});

// Protected route
app.get('/user-dash', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, message: 'User is authenticated' });
    } else {
        res.status(403).send('Unauthorized');
    }
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.json({ success: true });
    });
});