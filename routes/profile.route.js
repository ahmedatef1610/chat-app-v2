const router = require("express").Router();
/***********************************************************/
const profileController = require("../controllers/profile.controller");
/*********************************/
const authGuard = require("../middleware/auth.guard");
/*********************************/
router.get("/", authGuard.isAuth, profileController.redirect);
router.get("/:id", authGuard.isAuth, profileController.getProfile);
/***********************************************************/
module.exports = router;
