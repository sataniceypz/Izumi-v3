const config = require("../../config");
const { DataTypes } = require("sequelize");

// Define a data type for the database column
const dnb = { type: DataTypes.TEXT };

// Define the database options
const options = { db: dnb };

// Define the DataBase model
const DataBase = config.DATABASE.define("data", options);

// Function to set the database value
exports.setDB = async () => {
  // Fetch all entries from the database
  const entries = await DataBase.findAll();
  
  if (entries.length < 1) {
    // If no entries exist, create a new one with the global db value
    await DataBase.create({ db: JSON.stringify(global.db) });
  } else {
    // If an entry exists, update it with the global db value
    await entries[0].update({ db: JSON.stringify(global.db) });
  }
};

// Function to get the database value
exports.getDB = async () => {
  // Fetch all entries from the database
  const entries = await DataBase.findAll();
  
  if (entries.length > 0) {
    // If an entry exists, update the global db with its value
    global.db = JSON.parse(entries[0].db);
  }
};