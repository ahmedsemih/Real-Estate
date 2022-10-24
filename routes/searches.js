const express = require("express");
const router = express.Router();

const { getHomePage, getSearchPage } = require("../controllers/searches");

router.route("/").get(getHomePage);
router.route('/rent').get(getSearchPage);
router.route('/sale').get(getSearchPage);

module.exports = router;
