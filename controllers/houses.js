require("dotenv").config();

const House = require("../models/House");
const City = require("../models/City");
const District = require("../models/District");
const Favorite = require("../models/Favorite");
const User = require("../models/User");
const checkFavourite=require('../utils/checkFavorite');

const defaultErrors = {
  titleError: "",
  descriptionError: "",
  addressError: "",
  cityError: "",
  districtError: "",
  priceError: "",
  typeError: "",
  roomsError: "",
  bathroomsError: "",
  bathroomsError: "",
  buildingAgeError: "",
  floorError: "",
  grossSquareMeterError: "",
};

// Pages
exports.getHouseById = (req, res) => {
  const { id } = req.params;
  const currentUser = req.signedCookies.currentUser || null;

  House.findByPk(id,{include:[City,District,User]})
    .then((house) => {
      const { dataValues } = house;
      checkFavourite([house],currentUser).then((fav)=>{
        return res.render("house", { house: dataValues,fav });
      });
    })
    .catch((error) => console.log(error));
};

exports.getEditPage = (req, res) => {
  const { id } = req.params;

  City.findAll({}).then((cities) => {
    District.findAll({}).then((districts) => {
      House.findByPk(id)
        .then((house) => {
          const { dataValues } = house;
          res.render("edit", {
            house: dataValues,
            result: "",
            districts,
            cities,
            ...defaultErrors,
          });
        })
        .catch((error) => console.log(error));
    });
  });
};

exports.getAddPage = (req, res) => {
  City.findAll({}).then((cities) => {
    District.findAll({}).then((districts) => {
      res.render("new", {
        ...defaultErrors,
        result: "",
        districts,
        cities,
      });
    });
  });
};

// House Actions
exports.addHouse = (req, res) => {
  const { img, city, seller, district } = req.body;
  const urls = img.split(" ");
  const imageUrls = urls.filter((url) => {
    return url !== "";
  });
  const userId = req.signedCookies.currentUser;

  City.findAll({})
    .then((cities) => {
      District.findAll({}).then((districts) => {
        House.findAndCountAll({ where: { UserId: userId } }).then(({count}) => {
          if (count >= 10) {
            return res.render("new", {
              ...defaultErrors,
              result: "full",
              cities,
              districts,
            });
          }

          House.create({
            ...req.body,
            imageUrls,
            CityId: city,
            UserId: seller,
            DistrictId: district,
          })
            .then(() => {
              return res.render("new", {
                ...defaultErrors,
                result: "success",
                cities,
                districts,
              });
            })
            .catch((error) => {
              let result = "";

              error.errors &&
                error.errors.forEach((e) => {
                  switch (e.path) {
                    case "title":
                      defaultErrors.titleError = e.message;
                      break;
                    case "description":
                      defaultErrors.descriptionError = e.message;
                      break;
                    case "address":
                      defaultErrors.addressError = e.message;
                      break;
                    case "city":
                      defaultErrors.cityError = e.message;
                      break;
                    case "district":
                      defaultErrors.districtError = e.message;
                      break;
                    case "price":
                      defaultErrors.priceError = e.message;
                      break;
                    case "type":
                      defaultErrors.typeError = e.message;
                      break;
                    case "rooms":
                      defaultErrors.roomsError = e.message;
                      break;
                    case "bathrooms":
                      defaultErrors.bathroomsError = e.message;
                      break;
                    case "buildingAge":
                      defaultErrors.buildingAgeError = e.message;
                      break;
                    case "floor":
                      defaultErrors.floorError = e.message;
                      break;
                    case "grossSquareMeter":
                      defaultErrors.grossSquareMeterError = e.message;
                      break;
                    default:
                      result = e.message;
                      break;
                  }
                });

              return res.render("new", {
                ...defaultErrors,
                result,
                cities,
                districts,
              });
            });
        });
      });
    })
    .catch((error) => console.log(error));
};

exports.updateHouse = (req, res) => {
  const { img, city, seller, district } = req.body;
  const { id } = req.params;
  let images = [];
  if (img.length > 0) images = img.split(" ");

  House.findByPk(id).then((house) => {
    const urls = house.dataValues.imageUrls.concat(images);
    const imageUrls = urls.filter((url) => {
      return url !== "";
    });

    // Getting cities districts and house
    City.findAll({}).then((cities) => {
      District.findAll({}).then((districts) => {
        House.findByPk(id).then((house) => {
          const { dataValues } = house;

          // Updating House
          House.update(
            {
              ...req.body,
              imageUrls,
              CityId: city,
              UserId: seller,
              DistrictId: district,
            },
            { where: { id } }
          )
            .then(() => {
              return res.render("edit", {
                ...defaultErrors,
                result: "success",
                cities,
                districts,
                house: dataValues,
              });
            })
            .catch((error) => {
              let result = "";

              error.errors &&
                error.errors.forEach((e) => {
                  switch (e.path) {
                    case "title":
                      defaultErrors.titleError = e.message;
                      break;
                    case "description":
                      defaultErrors.descriptionError = e.message;
                      break;
                    case "address":
                      defaultErrors.addressError = e.message;
                      break;
                    case "city":
                      defaultErrors.cityError = e.message;
                      break;
                    case "district":
                      defaultErrors.districtError = e.message;
                      break;
                    case "price":
                      defaultErrors.priceError = e.message;
                      break;
                    case "type":
                      defaultErrors.typeError = e.message;
                      break;
                    case "rooms":
                      defaultErrors.roomsError = e.message;
                      break;
                    case "bathrooms":
                      defaultErrors.bathroomsError = e.message;
                      break;
                    case "buildingAge":
                      defaultErrors.buildingAgeError = e.message;
                      break;
                    case "floor":
                      defaultErrors.floorError = e.message;
                      break;
                    case "grossSquareMeter":
                      defaultErrors.grossSquareMeterError = e.message;
                      break;
                    default:
                      result = e.message;
                      break;
                  }
                });

              return res.render("edit", {
                ...defaultErrors,
                result,
                cities,
                districts,
                house: dataValues,
              });
            });
        });
      });
    });
  });
};

exports.deleteHouse = (req, res) => {
  const { id } = req.params;
  const currentUser = req.signedCookies.currentUser;

  Favorite.findAll({ where: { HouseId: id } })
    .then((favorite) => {
      if (favorite) {
        Favorite.destroy({ where: { HouseId: id } }).catch((error) => error);
      }
      House.destroy({ where: { id } })
        .then(() => {
          return res.redirect(`/accounts/${currentUser}`);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

// Favorites
exports.toggleFavorite = (req, res) => {
  const { id } = req.params;
  const UserId = req.signedCookies.currentUser;

  Favorite.findOne({
    where: { UserId, HouseId: id },
  })
    .then((favorite) => {
      if (favorite === null) {
        Favorite.create({ UserId, HouseId: id })
          .then(() => {
            if (`${process.env.BASE_URL}/` == req.headers.referer)
              return res.redirect("/#discover");
            return res.redirect("back");
          })
          .catch((error) => console.log(error));
      }

      Favorite.destroy({ where: { id: favorite.dataValues.id } })
        .then(() => {
          if (`${process.env.BASE_URL}/` == req.headers.referer)
            return res.redirect("/#discover");
          return res.redirect("back");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.deleteFavorites = (req, res) => {
  const UserId = req.signedCookies.currentUser;
  Favorite.destroy({ where: { UserId } })
    .then(() => {
      return res.redirect("back");
    })
    .catch((error) => console.log(error));
};
