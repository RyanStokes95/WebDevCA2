const mongoose = require('mongoose');

const uri = process.env.MONGODB_CONNECTION_STRING;

const connectDB = async () => {
    try {
      await mongoose.connect(uri);
      console.log("Successfully connected to MongoDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
    }
  };

module.exports = connectDB;