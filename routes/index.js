var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing")
});
// AUTH ROUTE
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    // res.send("Signing you up!");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpLongIsland "+user.username+"!");
            res.redirect("/places");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login"
}) ,function(req, res){

});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/places");
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     } 
//     res.redirect("/login");
// }

module.exports = router;