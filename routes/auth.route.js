const router = require("express").Router();
/***********************************************************/
const authController = require("../controllers/auth.controller");
/*********************************/
const check = require("express-validator").check;
const authGuard = require("../middleware/auth.guard");
/*********************************/
router.get("/signup", authGuard.notAuth, authController.getSignup);
router.post(
  "/signup",authGuard.notAuth,
  check("username").not().isEmpty().withMessage("username is required"),
  check("email").not().isEmpty().withMessage("email is required").isEmail().withMessage("invalid format"),
  check("password").not().isEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage("password must be al least 6 characters"),
  check("confirmPassword").custom((value, { req }) => {
    if (value == req.body.password) return true;
    else throw "confirm Password is not equal password";
  }),
  authController.postSignup
);
router.get("/login", authGuard.notAuth, authController.getLogin);
router.post(
  "/login",authGuard.notAuth, 
  check("email").not().isEmpty().withMessage("email is required").isEmail().withMessage("invalid format"),
  check("password").not().isEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
  authController.postLogin
);
router.all("/logout",authGuard.isAuth, authController.logout);
/***********************************************************/
module.exports = router;
