const UserDb = require("../models/user.db");
const validationResult = require("express-validator").validationResult;
/*********************************/
// 1 Get "/auth/signup"
exports.getSignup = (req, res, next) => {
  res.render("signup", {
    path: "/auth/signup",
    authError: req.flash("authError")[0],
    validationErrors: req.flash("validationErrors"),
    pageTitle: "Signup",
  });
};
// 2 Post "/auth/signup"
exports.postSignup = (req, res, next) => {
  //validationResult(req).array().length==0
  if (validationResult(req).isEmpty()) {
    UserDb.createNewUser(req.body.username, req.body.email, req.body.password)
      .then(() => {
        res.redirect("/auth/login");
      })
      .catch((err) => {
        req.flash("authError", err);
        res.redirect("/auth/signup");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/auth/signup");
  }
};
// 3 Get "/auth/login"
exports.getLogin = (req, res, next) => {
  res.render("login", {
    path: "/auth/login",
    authError: req.flash("authError")[0],
    validationErrors: req.flash("validationErrors"),
    pageTitle: "Login",
  });
};
// 4 Post "/auth/login"
exports.postLogin = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    UserDb.login(req.body.email, req.body.password)
      .then((result) => {
        req.session.userId = String(result._id);
        req.session.name = result.username;
        req.session.image = result.image;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("authError", err);
        res.redirect("/auth/login");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/auth/login");
  }
};
// 5 all "/auth/logout"
exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
