const express = require("express");
const router = express.Router();

const { getAdminPage, deleteHouse, banUser } = require("../controllers/admins");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

router.route("/").get(isAuthenticated, isAuthorized, getAdminPage);
router.route("/house").delete(isAuthenticated, isAuthorized, deleteHouse);
router.route("/ban").put(isAuthenticated, isAuthorized, banUser);

module.exports = router;
