const City = require("../models/City");
const District = require("../models/District");
const House = require("../models/House");
const checkFavorite = require("../utils/checkFavorite");

exports.getHomePage=(req,res)=>{
    const currentUser=req.signedCookies.currentUser;

    House.findAll({where:{type:"sale"},order:[["updatedAt","DESC"]],limit:4,include:[City,District]})
    .then((sales)=>{
        House.findAll({where:{type:"rent"},order:[["updatedAt","DESC"]],limit:4,include:[City,District]})
        .then((rents)=>{
            const all=sales.concat(rents);
            checkFavorite(all,currentUser).then((favs)=>{   
                console.log(favs)
                res.render('home',{rents,sales,favs});
            }); 
        }).catch((error)=>console.log(error));
    }).catch((error)=>console.log(error));
};

exports.getSearchPage=(req,res)=>{
    res.render('search');
}