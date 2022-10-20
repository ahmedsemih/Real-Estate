const House = require("../models/House");
const City = require("../models/City");
const District = require("../models/District");

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

exports.getHouseById = (req, res) => {};

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

exports.addHouse = (req, res) => {
  const { img, city, seller, district } = req.body;
  const imageUrls = img.split(" ");

  City.findAll({}).then((cities) => {
    District.findAll({}).then((districts) => {
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
};

exports.updateHouse = (req, res) => {};

exports.deleteHouse = (req, res) => {};
