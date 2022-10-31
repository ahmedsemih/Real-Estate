const express = require("express");
const router = express.Router();

const { getHomePage, getSearchPage, doSearch } = require("../controllers/searches");

router.route("/").get(getHomePage);
router.route("/search").get(doSearch);
router.route('/rent').get(getSearchPage);
router.route('/sale').get(getSearchPage);

module.exports = router;
