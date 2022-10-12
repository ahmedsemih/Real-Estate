const bcrypt = require("bcryptjs");
const e = require("express");
const User = require("../models/User");

exports.getLoginPage = (req, res) => {
  res.render("login");
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

exports.login = (req, res) => {};

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
    }).then(() => {
        return res.redirect("/auth/login");
    }).catch((error) => {
        let fullNameError = "";
        let emailError = "";
        let phoneError = "";
        let passwordError = "";
        let message = "";

        error && error.errors.forEach((e) => {
            switch (e.path) {
              case "fullName":
                fullNameError = e.message;
                break;
              case "email":
                e.validatorKey === "not_unique" ? (message = "This email is already in use.") : (emailError = e.message);
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
    }).then(() => {
        return res.redirect("/auth/login");
    }).catch((error) => {
        let fullNameError = "";
        let emailError = "";
        let phoneError = "";
        let passwordError = "";
        let companyNameError = "";
        let companyAddressError = "";
        let message = "";

        error && error.errors.forEach((e) => {
            switch (e.path) {
              case "fullName":
                fullNameError = e.message;
                break;
              case "email":
                e.validatorKey === "not_unique" ? (message = "This email is already in use.")
                  : (emailError = e.message);
                break;
              case "phone":
                phoneError = e.message;
                break;
              case "password":
                passwordError = e.message;
                break;
              case "companyName":
                e.validatorKey === "not_unique" ? (message = "This company is already a member.") : (companyNameError = e.message);
                break;
              case "companyAddress":
                companyAddressError = e.message;
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

};
