const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  getInfoPage,
  updateUser,
  wantResetEmail,
  getResetPage,
  resetEmailAndPassword,
  getSellerPage,
  getFavoritePage
} = require("../controllers/accounts");

router.route("/infos").get(isAuthenticated, getInfoPage);
router.route("/:id").get(getSellerPage);
router.route("/:id").put(isAuthenticated,updateUser);
router.route('/:id/favorites').get(isAuthenticated, getFavoritePage);

// Email and password reset
router.route("/want-reset/:email?").get(wantResetEmail);
router.route("/want-reset").post(wantResetEmail);
router.route("/reset/:resetId").get(getResetPage);
router.route("/reset/:resetId").put(resetEmailAndPassword);

module.exports = router;
