const Favorite = require("../models/Favorite");

module.exports = async (houses, userId) => {

  if(userId === undefined || houses === undefined) return false;
    const favoriteStatus = [];

    await Promise.all(
      houses.map(async (house) => {
        const result = await Favorite.findOne({
          where: { houseId: house.dataValues.id, userId },
        });
        result ? favoriteStatus.push(true) : favoriteStatus.push(false);
        return favoriteStatus;
      })
    );

  return favoriteStatus;
};
