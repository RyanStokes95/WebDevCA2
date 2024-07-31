/*
Recipe.js
Ryan Stokes
Created - 31/07/24
Last Modified - 31/07/24
*/

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    serves: Number,
    ingredients: [String],
    instructions: String,
    user: String
});
        
module.exports = mongoose.model("Recipe", recipeSchema, "recipes");