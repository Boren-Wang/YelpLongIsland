var express = require("express");
var router = express.Router({mergeParams: true});
var Place = require("../models/place"),
    Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Place.findById(req.params.id, function(err, place){
        if(err){
            //  console.log(err);
            req.flash("error", "Something went wrong!");
        } else {
             res.render("comments/new", {place: place});
        } 
     });
});

router.post("", middleware.isLoggedIn, function(req, res){
    // look up campground using ID
    Place.findById(req.params.id, function(err, place){
        if(err){
            console.log(err);
            res.redirect("/places");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    // console.log(err);
                    req.flash("error", "Something went wrong!");          
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    place.comments.push(comment);
                    place.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/places/" + place._id);
                }
            });
        }
    });
});


router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {place_id: req.params.id, comment: comment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/places/"+req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/places/"+req.params.id);
        }
    });
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     } 
//     res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next){
//     // is user logged in? 
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, comment){
//             if(err){
//                 console.log(err);
//                 res.redirect("back")
//             } else {
//                 // comment.author.id: mongoose.Schema.Types.ObjectId
//                 // req.user._id: String
//                 // does user own the comment?  
//                 if(comment.author.id.equals(req.user._id)) {
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