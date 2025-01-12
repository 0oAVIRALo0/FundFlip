const express = require("express");
const router = express.Router();
const {
  signupUser,
  signinUser,
  updateUser,
  bulkUser,
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/middleware");

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.put("/updateUser", authMiddleware, updateUser);
router.get("/bulk", authMiddleware, bulkUser);

module.exports = router;
