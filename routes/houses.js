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
  toggleFavorite,
  deleteFavorites
} = require("../controllers/houses");

router.route("/").post(isAuthenticated, addHouse);
router.route("/new").get(isAuthenticated, getAddPage);
router.route("/favorites").get(isAuthenticated,deleteFavorites);

router.route("/:id").get(getHouseById);
router.route("/:id").put(isAuthenticated, updateHouse);
router.route("/:id/destroy").get(isAuthenticated, deleteHouse);
router.route("/:id/edit").get(isAuthenticated, getEditPage);
router.route("/:id/favorite").get(isAuthenticated,toggleFavorite);

module.exports = router;
