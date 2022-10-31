const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

exports.getLoginPage = (req, res) => {
  res.render("login", { message: "" });
};

exports.getSignUpPage = (req, res) => {
  res.render("signup", {
    fullNameError: "",
    emailError: "",
    phoneError: "",
    passwordError: "",
    companyNameError: "",
    companyAddressError: "",
    isCorporate: false,
    again: false,
    message: "",
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } })
    .then((user) => {
      if (!user)
        return res.render("login", { message: "Wrong email or password." });
      bcrypt.compare(password, user.password).then((same) => {
        if (!same) return res.render("login", { message: "Wrong email or password." });
        if (user.type === "Banned") return res.render("login", { message: "Your account has been banned." });
        
        const accessToken = jwt.sign({ id: user.id, role: user.type }, process.env.SECRET_KEY, { 
          expiresIn: "1h" 
        });
        const refreshToken = jwt.sign({ id: user.id, role: user.type }, process.env.SECRET_KEY, {
          expiresIn: "2h"
        });

        res.cookie("accessToken", accessToken, {
          maxAge: Date.now() + 3600000,
          httpOnly: true,
          signed: process.env.COOKIE_SECRET,
        });
        res.cookie("refreshToken", refreshToken, {
          maxAge: Date.now() + 7200000,
          httpOnly: true,
          signed: process.env.COOKIE_SECRET,
        });
        res.cookie("currentUser", user.id, {
          maxAge: Date.now() + 3600000,
          httpOnly: true,
          signed: process.env.COOKIE_SECRET,
        });
        res.cookie("role",user.type, {
          maxAge: Date.now() + 3600000,
          httpOnly: true,
          signed: process.env.COOKIE_SECRET,
      });

        const url = req.cookies.previousPage || "/sale";
        res.clearCookie("previousPage");
        res.redirect(url);
      });
    })
    .catch((error) => console.log(error));
};

exports.createAccount = (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    type,
    companyName,
    companyAddress,
    accountType,
  } = req.body;
  if (!accountType) {
    User.create({
      fullName,
      email,
      phone,
      password,
      companyName: null,
      companyAddress: null,
    })
      .then(() => {
        return res.redirect("/auth/login");
      })
      .catch((error) => {
        let fullNameError = "";
        let emailError = "";
        let phoneError = "";
        let passwordError = "";
        let message = "";

        error &&
          error.errors.forEach((e) => {
            switch (e.path) {
              case "fullName":
                fullNameError = e.message;
                break;
              case "email":
                e.validatorKey === "not_unique"
                  ? (message = "This email is already in use.")
                  : (emailError = e.message);
                break;
              case "phone":
                phoneError = e.message;
                break;
              case "password":
                passwordError = e.message;
                break;
              default:
                message = e.message;
                break;
            }
          });

        return res.render("signup", {
          fullNameError,
          emailError,
          phoneError,
          passwordError,
          companyNameError: "",
          companyAddressError: "",
          isCorporate: false,
          again: true,
          message,
        });
      });
  } else {
    User.create({
      fullName,
      email,
      phone,
      password,
      type,
      companyName,
      companyAddress,
    })
      .then(() => {
        return res.redirect("/auth/login");
      })
      .catch((error) => {
        let fullNameError = "";
        let emailError = "";
        let phoneError = "";
        let passwordError = "";
        let companyNameError = "";
        let companyAddressError = "";
        let message = "";

        error &&
          error.errors.forEach((e) => {
            switch (e.path) {
              case "fullName":
                fullNameError = e.message;
                break;
              case "email":
                e.validatorKey === "not_unique"
                  ? (message = "This email is already in use.")
                  : (emailError = e.message);
                break;
              case "phone":
                phoneError = e.message;
                break;
              case "password":
                passwordError = e.message;
                break;
              case "companyName":
                e.validatorKey === "not_unique"
                  ? (message = "This company is already a member.")
                  : (companyNameError = e.message);
                break;
              case "companyAddress":
                companyAddressError = e.message;
                break;
              default:
                message = e.message;
                break;
            }
          });
        return res.render("signup", {
          fullNameError,
          emailError,
          phoneError,
          passwordError,
          companyNameError,
          companyAddressError,
          isCorporate: true,
          again: true,
          message,
        });
      });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("accessToken", { signed: process.env.COOKIE_SECRET });
  res.clearCookie("refreshToken", { signed: process.env.COOKIE_SECRET });
  res.clearCookie("currentUser", { signed: process.env.COOKIE_SECRET });
  res.redirect("/");
};
