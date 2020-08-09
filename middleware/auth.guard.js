exports.isAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
      res.redirect("/auth/login");
  }
};

exports.notAuth = (req, res, next) => {
    if (!req.session.userId) {
      next();
    } else {
        res.redirect("/");
    }
  };