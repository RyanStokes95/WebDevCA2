/*
dbconfig.js
Ryan Stokes
19/07/24
*/

require('dotenv').config();
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(require('express-session'));

// MongoDB connection string, hidden in .env variable
const uri = process.env.MONGODB_CONNECTION_STRING;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

// Configure MongoDBStore for sessions
const store = new MongoDBStore({
  uri: uri,
  collection: 'sessions',
});

// Handle MongoDBStore errors
store.on('error', function(error) {
  console.error('Session Store Error:', error);
});

// Export connection function and session store
module.exports = { connectDB, store };