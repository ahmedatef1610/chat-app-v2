const router = require("express").Router();
/***********************************************************/
const friendController = require("../controllers/friend.controller");
/*********************************/
const authGuard = require("../middleware/auth.guard");
/*********************************/
//router.post("/add", authGuard.isAuth, friendController.add);
router.post("/cancel", authGuard.isAuth, friendController.cancel);
router.post("/accept", authGuard.isAuth, friendController.accept);
router.post("/reject", authGuard.isAuth, friendController.reject);
router.post("/delete", authGuard.isAuth, friendController.delete);
/***********************************************************/
module.exports = router;
