const sequelize = require("./configs/database");
const cookieParser=require("cookie-parser");
const express = require("express");
require("dotenv").config();

const searchRoutes = require("./routes/searches");
const authRoutes = require("./routes/auths");
const accountRoutes = require("./routes/accounts");
const addToLocals = require("./middlewares/addToLocals");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(addToLocals);

// ROUTES
app.use("/", searchRoutes);
app.use("/auth", authRoutes);
app.use("/account", accountRoutes);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

sequelize.sync().then(() => {
  console.log("All datas synced");
});
