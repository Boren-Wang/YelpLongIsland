var Place = require("../models/place"),
    Comment = require("../models/comment");
var middlewareObj = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } 
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    },

    checkPlaceOwnership: function(req, res, next){
        // is user logged in? 
        if(req.isAuthenticated()){
            Place.findById(req.params.id, function(err, place){
                if(err){
                    // console.log(err);
                    req.flash("error", "Place not found");
                    res.redirect("back")
                } else {
                    // place.author.id: mongoose.Schema.Types.ObjectId
                    // req.user._id: String
                    // does user own the place?  
                    if(place.author.id.equals(req.user._id)) {
                        next();
                    // otherwise, redirect
                    } else {
                        req.flash("error", "You don't have the permission to do that");
                        res.redirect("back");
                    }
                }
            })
        // if not, redirect 
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    },

    checkCommentOwnership: function(req, res, next){
        // is user logged in? 
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    // console.log(err);
                    req.flash("error", "Comment not found");
                    res.redirect("back")
                } else {
                    // comment.author.id: mongoose.Schema.Types.ObjectId
                    // req.user._id: String
                    // does user own the comment?  
                    if(comment.author.id.equals(req.user._id)) {
                        next();
                    // otherwise, redirect
                    } else {
                        req.flash("error", "You need to be logged in to do that!");
                        res.redirect("back");
                    }
                }
            })
        // if not, redirect 
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    }
};

module.exports = middlewareObj;