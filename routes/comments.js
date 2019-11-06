var express = require("express");
var router = express.Router({mergeParams: true});
var Place = require("../models/place"),
    Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res){
    //find campground by id
    Place.findById(req.params.id, function(err, place){
        if(err){
             console.log(err);
        } else {
             res.render("comments/new", {place: place});
        } 
     });
});

router.post("", isLoggedIn, function(req, res){
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    place.comments.push(comment);
                    place.save();
                    res.redirect("/places/" + place._id);
                }
            });
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