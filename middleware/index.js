var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is user logged in?
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){
                    req.flash("error", "Campground not found!");
                    res.redirect("back");
                }
                else{
                    //Does user own the campground
                    // here " foundCampground.author.id == req.user._id " won't work because one is object type and another is string type instead they look alike 
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error", "You don't have the permission to do that!");
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
} 

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error", "Comment not found!");
                    res.redirect("back");
                }
                else{
                    //Does user own the campground
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error", "You don't have the permission to do that!");
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //flash type messages are always written before the redirecting page.
    //"error" is the key and the message is the value pair of the key.
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
}

module.exports = middlewareObj