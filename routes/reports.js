const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");
const { addReport, deleteReport } = require("../controllers/reports");

router.route("/:id/add").get(isAuthenticated, addReport);
router.route("/:id/delete").get(isAuthenticated, isAuthorized, deleteReport);

module.exports = router;
