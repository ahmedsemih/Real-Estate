const express = require("express");
const router = express.Router();

const {getLoginPage, getSignUpPage, login, createAccount, logout} = require('../controllers/auths');

router.route('/login').get(getLoginPage);
router.route('/login').post(login);

router.route('/signup').get(getSignUpPage);
router.route('/signup').post(createAccount);

router.route('/logout').get(logout);

module.exports = router;
