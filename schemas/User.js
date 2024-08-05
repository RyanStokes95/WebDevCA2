/*
User.js
Ryan Stokes
Created - 18/07/24
Last Modified - 05/08/24
*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    secondName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        max: 100,
        min: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    street: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
});
        
module.exports = mongoose.model("User", userSchema, "users");