const expressSession = require("express-session");
const mongodbStore = require("connect-mongodb-session");
require("dotenv").config();
function createSession() {
  const MongoDBStore = mongodbStore(expressSession);
  const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
    databaseName: "online-shop",
    collection: "session ",
  });
  return store;
}

function createSessionConfig() {
  return {
    secret: "keyboard-act",
    resave: false,
    saveUninitialized: false,
    store: createSession(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
