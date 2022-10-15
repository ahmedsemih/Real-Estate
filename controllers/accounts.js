const bcrypt=require("bcryptjs");
const axios = require("axios");
require("dotenv").config();

const User = require("../models/User");
const Reset = require("../models/Reset");
const { Op } = require("sequelize");

exports.getInfoPage = (req, res) => {
  const currentUser = req.signedCookies.currentUser;
  User.findByPk(currentUser)
    .then((user) => {
      const {
        fullName,
        email,
        phone,
        password,
        type,
        companyName,
        companyAddress,
      } = user.dataValues;
      const isCorporate = type !== "Individual" && type !== "Admin" ? true : false;
      res.render("infos", {
        fullName,
        email,
        phone,
        password,
        type,
        companyName,
        companyAddress,
        fullNameError: "",
        phoneError: "",
        companyNameError: "",
        companyAddressError: "",
        isCorporate,
        message: "",
        currentUser,
      });
    })
    .catch((error) => console.log(error));
};

exports.updateUser = (req, res) => {
  const { fullName, phone, companyName, oldCompanyName, companyAddress } =
    req.body;
  const currentUser = req.signedCookies.currentUser;

  User.update(
    {
      fullName,
      phone,
      companyName,
      companyAddress,
    },
    { where: { id: req.signedCookies.currentUser } }
  )
    .then(() => {
      return res.redirect("back");
    })
    .catch((error) => {
      User.findByPk(currentUser)
        .then((user) => {
          const {
            fullName,
            email,
            phone,
            password,
            type,
            companyName,
            companyAddress,
          } = user.dataValues;
          const isCorporate = type != "Individual" || "Admin" ? true : false;

          var fullNameError = "";
          var phoneError = "";
          var companyNameError = "";
          var companyAddressError = "";
          var message = "";

          error &&
            error.errors.forEach((e) => {
              switch (e.path) {
                case "fullName":
                  fullNameError = e.message;
                  break;
                case "phone":
                  phoneError = e.message;
                  break;
                case "companyName":
                  e.validatorKey === "not_unique"
                    ? companyName != oldCompanyName &&
                      (message = "This name is already in use.")
                    : (companyNameError = e.message);
                  break;
                case "companyAddress":
                  companyAddressError = e.message;
                  break;
                default:
                  message = "Somethings went wrong.";
                  break;
              }
            });

          return res.render("infos", {
            fullName,
            email,
            phone,
            password,
            type,
            isCorporate,
            companyName,
            companyAddress,
            fullNameError,
            phoneError,
            companyNameError,
            companyAddressError,
            message,
            currentUser,
          });
        })
        .catch((error) => console.log(error));
    });
};

exports.wantResetEmail = (req, res) => {
  const paramEmail = req.params.email;
  const bodyEmail = req.body.email;

  Reset.destroy({
    where: {
      expirationDate: { [Op.lte]: Date.now() },
    },
  });

  if(paramEmail === undefined && bodyEmail === undefined) return res.render("want-reset",{email:paramEmail});

  const email = paramEmail === undefined ? bodyEmail : paramEmail;

  User.findOne({ where: {email}})
    .then((user) => {
      const { id } = user.dataValues;
      Reset.create({
        UserId: id,
      })
        .then((reset) => {
          axios.request({
            method: "POST",
            url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
            headers: {
              "content-type": "application/json",
              "X-RapidAPI-Key": process.env.API_KEY,
              "X-RapidAPI-Host": process.env.API_HOST,
            },
            data: {"personalizations":[{"to":[{"email":email}],"subject":"Reset"}],"from":{"email":"no-reply@realestate.com"},"content":[{"type":"text/html","value":"<h1>You can reset your email and password by clicking the link below.</h1><br><a href='"+ process.env.BASE_URL + "/accounts/reset/" + reset.id+"'>"+process.env.BASE_URL + "/accounts/reset/" + reset.id+"</a>"}]},
          });
          return res.render("want-reset",{email});
        }).catch((error) => console.log(error));
    }).catch((error) => console.log(error));
};

exports.getResetPage = (req, res) => {
  const {resetId} = req.params;
  Reset.findByPk(resetId)
  .then((reset)=>{
    if(reset===null) return res.render("reset",{resetId:null,emailError:"",passwordError:""});
    return res.render("reset",{resetId,emailError:"",passwordError:""});
  }).catch((error)=>console.log(error));
};

exports.resetEmailAndPassword = (req, res) => {
  const {resetId}=req.params;
  const {oldEmail,newEmail,oldPassword,newPassword}=req.body;

  Reset.findByPk(resetId,{include:User})
  .then((reset)=>{
    const {id,email,password} = reset.dataValues.User.dataValues;
    var emailError="";
    var passwordError="";

    // Email Change
    if(oldEmail && email === oldEmail){
      User.update({email:newEmail},{where:{id}})
      .then(()=>{
        Reset.destroy({where:{id:resetId}}).catch((error)=>console.log(error));
        return res.render("reset",{resetId,emailError:"Successfully changed",passwordError})
      }).catch((error)=>{
        emailError=error.errors[0].message;
        return res.render("reset",{resetId,emailError,passwordError});
      });
    }else if(oldEmail !== undefined){
      return res.render("reset",{resetId,emailError:"Old email doesn't match your current email.",passwordError});
    }

    // Password Change
    oldPassword !== undefined && bcrypt.compare(oldPassword,password)
    .then((same)=>{
      if(!same) return res.render("reset",{resetId,emailError,passwordError:"Old password doesn't match your current password."});
      
      bcrypt.hash(newPassword,10).then((hashedPassword)=>{
        User.update({password:hashedPassword},{where:{id}})
        .then(()=>{
          Reset.destroy({where:{id:resetId}}).catch((error)=>console.log(error));
          return res.render("reset",{resetId,emailError,passwordError:"Successfully changed"})
        }).catch((error)=>{
          passwordError=error.errors[0].message;
          return res.render("reset",{resetId,emailError,passwordError});
        });
      });
    });
  }).catch((error)=>console.log(error));
};