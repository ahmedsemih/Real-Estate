const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  res.cookie("previousPage", req.headers.referer || req.headers.referrer);

  jwt.verify(
    req.signedCookies.refreshToken,
    process.env.SECRET_KEY,
    (error, decoded) => {
      if (error) {
        res.clearCookie("currentUser");
        return res.redirect("/auth/login");
      }

      const { id, exp, role } = decoded;

      if (exp * 1000 - Date.now() < 4200000) {
        const accessToken = jwt.sign({ id, role }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ id, role }, process.env.SECRET_KEY, {
          expiresIn: "2h",
        });
        res.cookie("accessToken", accessToken, {
          maxAge: Date.now() + 3600000,
          httpOnly: true,
          signed: process.env.COOKIE_SECRET,
        });
        res.cookie("refreshToken", refreshToken, {
          maxAge: Date.now() + 7200000,
          httpOnly: true,
          signed: process.env.COOKIE_SECRET,
        });
      }
      next();
    }
  );
};
