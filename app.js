const methodOverride = require("method-override");
const sequelize = require("./configs/database");
const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();

const searchRoutes = require("./routes/searches");
const authRoutes = require("./routes/auths");
const accountRoutes = require("./routes/accounts");
const houseRoutes = require("./routes/houses");
const reportRoutes = require("./routes/reports");
const adminRoutes = require("./routes/admins");
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
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// ROUTES
app.use("/", searchRoutes);
app.use("/auth", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/houses", houseRoutes);
app.use("/reports", reportRoutes);
app.use("/admin",adminRoutes);
app.get("*",(req,res)=>{
  const {q}=req.query;
  res.render("notfound",{search:false,q});
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

sequelize.sync().then(() => {
  console.log("All datas synced");
});
