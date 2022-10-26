const sequelize=require("../configs/database.js");
const {DataTypes}=require("sequelize");
const House = require("./House.js");

const Report=sequelize.define("Report",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        autoIncrementIdentity:true,
        primaryKey:true
    }
},{
    updatedAt:false
});

Report.belongsTo(House,{
    foreignKey:{
        allowNull:false
    }
});

module.exports=Report;