const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const City=require('./City');

const District = sequelize.define(
  "District",
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
    }
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

District.belongsTo(City,{
    foreignKey:{
        allowNull:false,
        field:"cityId"
    }
});

module.exports = District;
