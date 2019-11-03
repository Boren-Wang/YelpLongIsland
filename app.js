var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Place = require("./models/place"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

seedDB();
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

app.get("/", function(req, res){
    res.render("landing")
});

app.get("/places", function(req, res){
    // get all places from DB
    Place.find({}, function(err, places){
        if(err){
            console.log(err);
        } else {
            res.render("places/index", {places:places})
        }
    })
});

app.post("/places", isLoggedIn, function(req, res){
    // get data from the form
    var name = req.body.name
    var image = req.body.image 
    var description = req.body.description 
    var newPlace = {name: name, image: image, description: description};
    // create a new place and save to DB
    Place.create(newPlace, function(err, place){
        if(err){
            console.log(err);
        } else {
            // redirect back to places page
            res.redirect("/places");
        }
    });
});

app.get("/places/new", isLoggedIn, function(req, res){
    res.render("places/new");
});

app.get("/places/:id", function(req, res){
    // find the place with provided ID
    Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace){
        if(err){
            console.log(err);
        }else{
            console.log(foundPlace);
            // render show template with that place
            res.render("places/show", {place: foundPlace});
        }
    });
});


app.get("/places/:id/comments/new", isLoggedIn, function(req, res){
    //find campground by id
    Place.findById(req.params.id, function(err, place){
        if(err){
             console.log(err);
        } else {
             res.render("comments/new", {place: place});
        } 
     });
});

app.post("/places/:id/comments", isLoggedIn, function(req, res){
    // look up campground using ID
    Place.findById(req.params.id, function(err, place){
        if(err){
            console.log(err);
            res.redirect("/places");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);          
                } else {
                    place.comments.push(comment);
                    place.save();
                    res.redirect("/places/" + place._id);
                }
            });
        }
    });
});

// AUTH ROUTE
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    // res.send("Signing you up!");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/places");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login"
}) ,function(req, res){

});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/places");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

app.listen(3000, process.env.IP, function(){
    console.log("YelpLongIsland Has Started!")
});