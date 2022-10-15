const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const { getInfoPage, updateUser,wantResetEmail, getResetPage,resetEmailAndPassword } = require("../controllers/accounts");

router.route("/:id").get();
router.route("/:id").put(updateUser);
router.route("/:id").delete();
router.route("/infos").get(isAuthenticated, getInfoPage);

// Email and password reset
router.route("/want-reset/:email?").get(wantResetEmail);
router.route("/want-reset").post(wantResetEmail);
router.route("/reset/:resetId").get(getResetPage);
router.route("/reset/:resetId").put(resetEmailAndPassword);

module.exports = router;
