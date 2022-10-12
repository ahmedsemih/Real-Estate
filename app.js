const sequelize = require("./configs/database");
const express = require("express");
require("dotenv").config();

const searchRoutes = require("./routes/searches");
const authRoutes = require("./routes/auths");
const accountRoutes = require("./routes/accounts");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
