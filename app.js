require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectDB = require("./server/config/db");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");


const app = express();
const PORT = process.env.PORT || 5000;
app.use(session({
    secret: "cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: new Date(Date.now() + (3600000)) } //7days 604800000
    //Date.now() - 30 * 24 * 60 * 60 * 1000 30days
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
//Connect to Database 
connectDB();

//Static Files
app.use(express.static("public"));

//Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//ROUTES
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/dashboard"));

// Handle 404
app.get("*", (req, res) => {
  //res.status(404).send("404 Page Not Found.");
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
