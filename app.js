var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"); // used for update and delete route
    Place = require("./models/place"),
    Comment = require("./models/comment"),
    User = require("./models/user");
    // seedDB = require("./others/seeds");

var commentRoutes = require("./routes/comments"),
    placeRoutes = require("./routes/places"),
    indexRoutes = require("./routes/index");

// seedDB();
var databaseUrl = process.env.DATABASEURL || "mongodb://localhost/yelp_long_island";
mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public")); // serve all files inside of the public
app.use(methodOverride("_method")); // used for update and delete route
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/places", placeRoutes);
app.use("/places/:id/comments", commentRoutes);

var port = process.env.PORT || 8080;
app.listen(port, process.env.IP, function(){
    console.log("YelpLongIsland Has Started!")
});