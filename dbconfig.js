/*
dbconfig.js
Ryan Stokes
19/07/24
*/

require('dotenv').config();
const mongoose = require('mongoose');

//Mongo DB connection string, hidden in .env variable
const uri = process.env.MONGODB_CONNECTION_STRING;

//Connection to Mongo DB utilising Mongoose
const connectDB = async () => {
  //Error handling for DB connection
    try {
      await mongoose.connect(uri);
      console.log("Successfully connected to Mongoose");
    } catch (err) {
      console.error("Failed to connect to Mongoose", err);
    }
  };

//Module export to be used in server.js
module.exports = connectDB;