var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Place = require("./models/place"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./others/seeds");

var commentRoutes = require("./routes/comments"),
    placeRoutes = require("./routes/places"),
    indexRoutes = require("./routes/index");

// seedDB();
mongoose.connect("mongodb://localhost/yelp_long_island", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "CSE",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/places", placeRoutes);
app.use("/places/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("YelpLongIsland Has Started!")
});