var express = require("express");
var router = express.Router();
var Place = require("../models/place");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // automatically require content of index.js

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

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from the form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPlace = {name: name, price: price, image: image, description: description, author: author};
    // create a new place and save to DB
    Place.create(newPlace, function(err, place){
        if(err){
            // console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            // redirect back to places page
            req.flash("success", "Successfully created a new place!");
            res.redirect("/places");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("places/new");
});

router.get("/:id", function(req, res){
    // find the place with provided ID
    Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace){
        if(err){
            console.log(err);
        }else{
            // render show template with that place
            res.render("places/show", {place: foundPlace});
        }
    });
});

// EDIT PLACE ROUTE
router.get("/:id/edit", middleware.checkPlaceOwnership, function(req, res){
    Place.findById(req.params.id, function(err, place){
        if(err){
            console.log(err);
            res.redirect("/places")
        } else {
            res.render("places/edit", {place:place});
        }
    })
})

// UPDATE PLACE ROUTE
router.put("/:id", middleware.checkPlaceOwnership, function(req, res){
    // find and update the correct place
    Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, place){
        if(err){
            console.log(err);
            res.redirect("/places");
        } else {
            res.redirect("/places/"+req.params.id);
        }
    });
});

// DESTORY PLACE ROUTE
router.delete("/:id", middleware.checkPlaceOwnership, function(req, res){
    Place.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/places");
        } else {
            res.redirect("/places");
        }
    }) 
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     } 
//     res.redirect("/login");
// }

// function checkPlaceOwnership(req, res, next){
//     // is user logged in? 
//     if(req.isAuthenticated()){
//         Place.findById(req.params.id, function(err, place){
//             if(err){
//                 console.log(err);
//                 res.redirect("back")
//             } else {
//                 // place.author.id: mongoose.Schema.Types.ObjectId
//                 // req.user._id: String
//                 // does user own the place?  
//                 if(place.author.id.equals(req.user._id)) {
//                     next();
//                 // otherwise, redirect
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         })
//     // if not, redirect 
//     } else {
//         res.redirect("back");
//     }
// }
module.exports = router;