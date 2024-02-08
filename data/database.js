const { MongoClient } = require("mongodb");

let database;

let mongodbUrl =
  "mongodb+srv://kariukibenard189:Benada254@cluster0.lzdomio.mongodb.net/?retryWrites=true&w=majority";

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
