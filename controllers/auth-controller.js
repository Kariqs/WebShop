const User = require("../models/user-model");
const authUtil = require("../utils/authentication");
const validation = require("../utils/validation");
const sessionFlash = require("../utils/session-flash");
function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
      confirmEmail: "",
      fullname: "",
      city: "",
      phone: "",
    };
  }
  res.render("customers/auth/signup", { sessionData: sessionData });
}
async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    confirmEmail: req.body["confirm-email"],
    fullname: req.body.fullname,
    city: req.body.city,
    phone: req.body.phone,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.city,
      req.body.phone
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: "Please check your input and try again.",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.city,
    req.body.phone
  );

  try {
    const existsAlredy = await user.alreadyExists();
    if (existsAlredy) {
      sessionFlash.flashDataToSession(
        req,
        { message: "User already exists - Try logging in.", ...enteredData },
        function () {
          res.redirect("/signup");
        }
      );

      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}
function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = { email: "", password: "" };
  }
  res.render("customers/auth/login", { sessionData: sessionData });
}
async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  let passwordIsCorrect;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: "User doesn't exist - Create account.",
        email: req.body.email,
        password: req.body.password,
      },
      function () {
        res.redirect("/login");
      }
    );

    return;
  }
  try {
    passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);
  } catch (error) {
    next(error);
    return;
  }
  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: "Wrong password",
        email: req.body.email,
        password: req.body.password,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
