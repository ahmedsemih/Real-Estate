const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const City = require("./City");
const District = require("./District");
const User = require("./User");

const House = sequelize.define("House", {
  id: {
    type: DataTypes.UUID(),
    defaultValue: DataTypes.UUIDV4(),
    primaryKey: true,
  },
  imageUrls: {
    type: DataTypes.ARRAY({
      type: DataTypes.STRING,
    }),
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: {
        msg: "Price must be numbers.",
      },
    },
  },
  type: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate:{
      notContains:{
        args:"Select Type",
        msg:"Please choose what you want to do with the house."
      }
    }
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate:{
      notContains:{
        args:"Bathrooms",
        msg:"Please select how many bathrooms there are in the house."
      }
    }
  },
  rooms: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate:{
      notContains:{
        args:"Rooms",
        msg:"Please select how many rooms there are in the house."
      }
    }
  },
  grossSquareMeter: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  buildingAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isInHousingEstate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isInTheCenter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  closeToPublicTransportation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  closeToHospital: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  closeToSchool: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  closeToShops: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasElevator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasYard: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasGenerator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasThermalInsulation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasBalcony: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasParquet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasNaturalGas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasSteelDoor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasFurnish: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

House.belongsTo(User, {
  foreignKey: {
    allowNull: false,
    field: "seller"
  },
});

House.belongsTo(City, {
  foreignKey: {
    allowNull: false,
    field: "city"
  }
});

House.belongsTo(District, {
  foreignKey: {
    allowNull: false,
    field: "district"
  },
});

module.exports = House;
