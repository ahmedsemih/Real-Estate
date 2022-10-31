const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const sequelize = require("../configs/database");

const User = sequelize.define("User",{
    id: {
      primaryKey: true,
      type: DataTypes.UUID(),
      defaultValue:DataTypes.UUIDV4()
    },
    imageUrl:{
      type:DataTypes.STRING,
      defaultValue:"https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png"
    },
    fullName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [5, 50],
          msg: "fullname must be min 5 - max 50 characters.",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "email must be valid.",
        },
      },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: {
          args: true,
          msg: "phone number must be valid.",
        },
      },
    },
    password: {
      type: DataTypes.STRING(),
      allowNull: false,
      validate: {
        len: {
          args: [5, 255],
          msg: "password must be min 5 - max 30 characters.",
        },
      },
    },
    type: {
      type: DataTypes.STRING(30),
      defaultValue:"Individual"
    },
    companyName: {
      type: DataTypes.STRING(100),
      unique:true,
      allowNull:true,
      validate:{
        len:{
          args:[3,100],
          msg:"company name must be min 3 - max 100 characters."
        }
      }
    },
    companyAddress: {
      type: DataTypes.STRING(255),
      allowNull:true,
      validate:{
        len:{
          args:[10,255],
          msg:"company address must be valid."
        }
      }
    },
  },
  {
    updatedAt: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 10);
      }
    }
  });

module.exports = User;
