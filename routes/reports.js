const express = require("express");
const router = express.Router();

const { addReport, deleteReport } = require("../controllers/reports");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/:id/add").get(isAuthenticated, addReport);
router.route("/:id/delete").get(isAuthenticated, deleteReport);

module.exports = router;
