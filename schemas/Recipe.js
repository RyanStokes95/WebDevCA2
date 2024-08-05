/*
Recipe.js
Ryan Stokes
Created - 31/07/24
Last Modified - 05/08/24
*/

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    serves: {
        type: Number,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    steps: {
        type: [String],
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
});

recipeSchema.index({ title: 1, username: 1 }, { unique: true });
        
module.exports = mongoose.model("Recipe", recipeSchema, "recipes");