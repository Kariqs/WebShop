const { MongoClient } = require("mongodb");

let database;

async function connectToDatabase() {
  const client = new MongoClient("mongodb://127.0.0.1:27017").connect();
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
