const User = require("../models/User");
const Report = require("../models/Report");
const Favorite = require("../models/Favorite");
const House = require("../models/House");

exports.getAdminPage = (req, res) => {
  Report.findOne({ order: [["createdAt", "ASC"]],include:[{model:House,include:[User]}] })
    .then((report) => {
        if(!report) return res.render("admin",{report:""});
        const {dataValues} = report;
        res.render("admin",{report:dataValues});
    })
    .catch((error) => console.log(error));
};

exports.banUser = (req, res) => {
  const { email } = req.body;

  User.update(
    {
      type: "Banned",
    },
    { where: { email } }
  )
    .then(() => {
      res.redirect("/admin");
    })
    .catch((error) => console.log(error));
};

exports.deleteHouse = (req, res) => {
  const { id } = req.body;

  Report.destroy({ where: { HouseId: id } });
  Favorite.destroy({ where: { HouseId: id } });
  House.destroy({ where: { id } })
    .then(() => {
      res.redirect("/admin");
    })
    .catch((error) => console.log(error));
};
