/*********************************/
// 1 Get "/"
exports.getHome = (req, res, next) => {
  res.render("index", {
    path: "/",
    pageTitle: "Home",
  });
};
