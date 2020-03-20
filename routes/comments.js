var express = require("express");
var router = express.Router({mergeParams: true});
//mergeParams: ture->will merge the params from the campgrounds and the comments together. This became a problem when we have shorten our routes url.
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id:
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){    
        if(err || !campground){
            req.flash("error", "Campground Not Found!");            
            res.redirect("back");
        }
        else{
            res.render("comments/new", {campground: campground});
        }
    });
});
//Comments Create
router.post("/new", middleware.isLoggedIn,function(req, res) {
    //lookup campground using id:
    Campground.findById(req.params.id, function(err, campground){    
        if(err || !campground){
            req.flash("error", "Campground Not Found!");            
            res.redirect("back");
        }
        else{
            Comment.create(req.body.comment, function(err,comment){
               if(err)
                    console.log(err);
                else{
                    comment.author.id = req.user._id;                    
                    comment.author.username = req.user.username; 
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect('/campgrounds/' + campground._id);
                }
                
            });
            // console.log();
        } 
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

//Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err || !foundComment){
            req.flash("error", "Comment Not Found!");            
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        }    
    });
});

//Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err || !updatedComment){
            req.flash("error", "Comment Not Found!");            
            res.redirect("back");
        }
        else{
            req.flash("success", "Succesfully Updated Comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Comment Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Unable to delete the comment!");            
            res.redirect("back");
        }
        else{
            req.flash("success", "Succesfully deleted the comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;