const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  getHouseById,
  getAddPage,
  getEditPage,
  addHouse,
  updateHouse,
  deleteHouse,
  toggleFavorite
} = require("../controllers/houses");

router.route("/").post(isAuthenticated, addHouse);
router.route("/new").get(isAuthenticated, getAddPage);
router.route("/edit").get(isAuthenticated, getEditPage);

router.route("/:id").get(getHouseById);
router.route("/:id").put(isAuthenticated, updateHouse);
router.route("/:id").delete(isAuthenticated, deleteHouse);
router.route("/:id/favorite").get(isAuthenticated,toggleFavorite);

module.exports = router;