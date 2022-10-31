const { Op } = require("sequelize");
const City = require("../models/City");
const District = require("../models/District");
const House = require("../models/House");
const User = require("../models/User");
const checkFavorite = require("../utils/checkFavorite");

exports.getHomePage = async (req, res) => {
  const currentUser = await req.signedCookies.currentUser;

  const sales = await House.findAll({
    where: { type: "sale" },
    order: [["updatedAt", "DESC"]],
    limit: 4,
    include: [City, District],
  });
  const rents = await House.findAll({
    where: { type: "rent" },
    order: [["updatedAt", "DESC"]],
    limit: 4,
    include: [City, District],
  });
  const all = sales.concat(rents);
  const favs = await checkFavorite(all, currentUser);
  return res.render("home", { rents, sales, favs });
};

exports.doSearch = async (req,res)=>{
  const {q}=await req.query;
    
  // Getting city by name
  const city = await City.findOne({where:{name:{[Op.iLike]:q}}});
  if(city) return res.redirect(`/sale?city=${city.dataValues.id}`);
  
  // Getting district by name
  const district = await District.findOne({where:{name:{[Op.iLike]:q}}});
  if(district) return res.redirect(`/sale?district=${district.dataValues.id}`);
  
  // Getting seller by name or company name
  const seller = await User.findOne({where:{[Op.or]:[{fullName:{[Op.iLike]:q}},{companyName:{[Op.iLike]:q}}]}});
  if (seller) return res.redirect(`accounts/${seller.dataValues.id}`);
  
  // Getting type
  switch(q){
    case "sale":
      res.redirect("/sale");
      break;
    case "rent":
      res.redirect("/rent");
    default:
      return res.render("notfound",{search:true,q});
  }
};

exports.getSearchPage = async (req, res) => {
  const {
    city,
    district,
    lowestprice,
    lowestmeter,
    highestmeter,
    highestprice,
    hasBalcony,
    hasElevator,
    hasFurnish,
    isInHousingEstate,
    rooms,
    bathrooms,
    buildingAge,
    floor,
  } = req.query;

  const filters = await req.query;
  const currentUser = await req.signedCookies.currentUser;
  const page = await req.query.page || 1;
  const path = await req.path.split("/")[1];

  const urlForPage = await req.url.split("isInHousingEstate")[0];
  const originalUrl = await req.originalUrl;

  const cityQuery = city !== "404" && city ? city : { [Op.ne]: 404 };
  const districtQuery =
    district !== "404" && district ? district : { [Op.ne]: 404 };
  const lowestPrice =
    lowestprice !== "" && lowestprice ? Number(lowestprice) : 0;
  const highestPrice =
    highestprice !== "" && highestprice ? Number(highestprice) : 999999999;
  const lowestMeter =
    lowestmeter !== "" && lowestmeter ? Number(lowestmeter) : 0;
  const highestMeter =
    highestmeter !== "" && highestmeter ? Number(highestmeter) : 999999;
  const priceQuery = { [Op.between]: [lowestPrice, highestPrice] };
  const meterQuery = { [Op.between]: [lowestMeter, highestMeter] };
  const hasFurnishQuery =
    hasFurnish !== "all" && hasFurnish
      ? hasFurnish
      : { [Op.or]: [true, false] };
  const hasBalconyQuery =
    hasBalcony !== "all" && hasBalcony
      ? hasBalcony
      : { [Op.or]: [true, false] };
  const hasElevatorQuery =
    hasElevator !== "all" && hasElevator
      ? hasElevator
      : { [Op.or]: [true, false] };
  const isInHousingEstateQuery =
    isInHousingEstate != "all" && isInHousingEstate
      ? isInHousingEstate
      : { [Op.or]: [true, false] };
  const roomsQuery =
    rooms && rooms.length != 6 ? { [Op.or]: [rooms] } : { [Op.ne]: "test" };
  const bathroomsQuery =
    bathrooms && bathrooms.length != 6
      ? { [Op.or]: [bathrooms] }
      : { [Op.ne]: 100 };
  const floorQuery =
    floor && floor.length != 6
      ? floor && floor.includes("5")
        ? { [Op.or]: [{ [Op.or]: [floor] }, { [Op.gte]: 5 }] }
        : { [Op.or]: [floor] }
      : { [Op.ne]: 100 };
  const buildingAgeQuery =
    buildingAge && buildingAge.length != 6
      ? Array.isArray(buildingAge)
        ? {
            [Op.between]: [buildingAge[0], buildingAge[buildingAge.length - 1]],
          }
        : { [Op.lte]: buildingAge }
      : { [Op.lte]: 1000 };

  const cities = await City.findAll();
  const districts = await District.findAll();
  const {count} = await House.findAndCountAll({
    where: {
        type: path,
        CityId: cityQuery,
        DistrictId: districtQuery,
        price: priceQuery,
        grossSquareMeter: meterQuery,
        hasFurnish: hasFurnishQuery,
        hasBalcony: hasBalconyQuery,
        hasElevator: hasElevatorQuery,
        isInHousingEstate: isInHousingEstateQuery,
        rooms: roomsQuery,
        bathrooms: bathroomsQuery,
        floor: floorQuery,
        buildingAge: buildingAgeQuery,
      }
  });
  const houses = await House.findAll({
    where: {
      type: path,
      CityId: cityQuery,
      DistrictId: districtQuery,
      price: priceQuery,
      grossSquareMeter: meterQuery,
      hasFurnish: hasFurnishQuery,
      hasBalcony: hasBalconyQuery,
      hasElevator: hasElevatorQuery,
      isInHousingEstate: isInHousingEstateQuery,
      rooms: roomsQuery,
      bathrooms: bathroomsQuery,
      floor: floorQuery,
      buildingAge: buildingAgeQuery,
    },
    include: [{ all: true }],
    limit: 10,
    offset: (page - 1) * 10,
    order: [["updatedAt","DESC"]],
  });

  const favs = await checkFavorite(houses, currentUser);

  return res.render("search", {
    cities,
    districts,
    path,
    count,
    page,
    houses,
    favs,
    filters,
    urlForPage,
    originalUrl
  });
};
