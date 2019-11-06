var express = require("express");
var router = express.Router();
var Place = require("../models/place");
var Comment = require("../models/comment");

router.get("/", function(req, res){
    // get all places from DB
    Place.find({}, function(err, places){
        if(err){
            console.log(err);
        } else {
            res.render("places/index", {places:places})
        }
    })
});

router.post("/", isLoggedIn, function(req, res){
    // get data from the form
    var name = req.body.name
    var image = req.body.image 
    var description = req.body.description 
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPlace = {name: name, image: image, description: description, author: author};
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

router.get("/new", isLoggedIn, function(req, res){
    res.render("places/new");
});

router.get("/:id", function(req, res){
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;