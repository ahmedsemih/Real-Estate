const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  getHouseById,
  getAddPage,
  addHouse,
  updateHouse,
  deleteHouse,
} = require("../controllers/houses");

router.route("/").post(isAuthenticated, addHouse);
router.route("/new").get(isAuthenticated, getAddPage);

router.route("/:id").get(getHouseById);
router.route("/:id").put(isAuthenticated, updateHouse);
router.route("/:id").delete(isAuthenticated, deleteHouse);

module.exports = router;
