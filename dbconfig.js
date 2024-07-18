require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_CONNECTION_STRING;

const connectDB = async () => {
    try {
      await mongoose.connect(uri);
      console.log("Successfully connected to Mongoose");
    } catch (err) {
      console.error("Failed to connect to Mongoose", err);
    }
  };

module.exports = connectDB;