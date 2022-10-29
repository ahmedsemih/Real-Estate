const Report = require("../models/Report");

exports.addReport = (req, res) => {
  const { id } = req.params;

  Report.findOne({ where: { HouseId: id } })
    .then((report) => {
      if (report !== null) return res.redirect("back");

      Report.create({ HouseId: id })
        .then(() => {
          return res.redirect("back");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.deleteReport = (req, res) => {
  const { id } = req.params;

  Report.destroy({ where: { id } })
    .then(() => {
      return res.redirect("back");
    })
    .catch((error) => {
      console.log(error);
    });
};
