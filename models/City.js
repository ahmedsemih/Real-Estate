const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const City = sequelize.define(
  "City",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity:true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique:true
    }
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = City;
