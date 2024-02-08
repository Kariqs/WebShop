const expressSession = require("express-session");
const mongodbStore = require("connect-mongodb-session");
function createSession() {
  const MongoDBStore = mongodbStore(expressSession);
  const store = new MongoDBStore({
    uri: "mongodb+srv://kariukibenard189:Benada254@cluster0.lzdomio.mongodb.net/?retryWrites=true&w=majority",
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
