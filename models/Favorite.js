const sequelize=require('../configs/database');
const {DataTypes}=require("sequelize");
const House = require('./House');
const User = require('./User');

const Favorite=sequelize.define("Favorite",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        autoIncrementIdentity:true
    }
},{
    createdAt:false,
    updatedAt:false
});

Favorite.belongsTo(User,{
    foreignKey:{
        field:"userId",
        allowNull:false
    }
});

Favorite.belongsTo(House,{
    foreignKey:{
        field:"houseId",
        allowNull:false
    }
})

module.exports=Favorite;