const {DataTypes}=require('sequelize');
const sequelize=require('../configs/database');

const User=require('../models/User');

const Reset=sequelize.define('Reset',
{
    id:{
        type:DataTypes.UUID(),
        defaultValue:DataTypes.UUIDV4(),
        primaryKey:true,
    },
    expirationDate:{
        type:DataTypes.DATE,
        allowNull:true,
    }
},{
    createdAt:false,
    updatedAt:false,
    hooks:{
        beforeCreate:async (reset) => {
            reset.expirationDate=Date.now()+3600000;
        }
    }
});

Reset.belongsTo(User,{
    foreignKey:{
        allowNull:false
    }
})

module.exports=Reset;