/*
User.js
Ryan Stokes
Created - 18/07/24
Last Modified - 01/08/24
*/

const mongoose = require("mongoose");

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
});
        
module.exports = mongoose.model("User", userSchema, "users");