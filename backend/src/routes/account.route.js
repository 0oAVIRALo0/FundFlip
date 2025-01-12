const express = require("express");
const router = express.Router();
const { checkBalance, transfer } = require("../controllers/account.controller");
const authMiddleware = require("../middleware/middleware");

router.route("/balance").post(authMiddleware, checkBalance);
router.route("/transfer").post(authMiddleware, transfer);

module.exports = router;
