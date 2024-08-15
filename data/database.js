const { MongoClient } = require("mongodb");
require("dotenv").config();

let database;

let mongodbUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

async function connectToDatabase() {
  const client = new MongoClient(mongodbUrl).connect();
  database = (await client).db("online-shop");
}

function getDatabase() {
  if (!database) {
    throw new Error("You must connect to database first.");
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDatabase: getDatabase,
};
