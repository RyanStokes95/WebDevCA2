/*
User.js
Ryan Stokes
Created - 18/07/24
Last Modified - 18/07/24
*/

const mongoose = require("mongoose");
const Recipe = require("./Recipe")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    secondName: String,
    age: Number,
    email: String,
    street: String,
    town: String,
    city: String,
    country: String,
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});
        
module.exports = mongoose.model("User", userSchema, "users");