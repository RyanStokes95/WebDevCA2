const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    age: Number,
    email: String,
    street: String,
    town: String,
    city: String,
    country: String
});
        
module.exports = mongoose.model("User", userSchema, "users");