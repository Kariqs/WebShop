const express = require("express");
const expressSession = require("express-session");
const path = require("path");
const authRoutes = require("./routes/auth-routes");
const productsRoutes = require("./routes/product-routes");
const baseRoutes = require("./routes/base-routes");
const adminRoutes = require("./routes/admin-routes");
const cartRoutes = require("./routes/cart-routes");

const protectRoutes = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const checkAuthMiddlware = require("./middlewares/check-auth");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const csrf = require("csurf");
const csrfToken = require("./middlewares/csrf-Token");
const erroHandlerMiddleware = require("./middlewares/error-handler");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));

app.use(expressSession(createSessionConfig()));
app.use(csrf());

app.use(cartMiddleware);

app.use(csrfToken);
app.use(checkAuthMiddlware);
app.use(authRoutes);
app.use(baseRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use(protectRoutes);
app.use("/admin", adminRoutes);

app.use(erroHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Error connecting to database");
    console.log(error);
  });
