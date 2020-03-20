var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req,res){
    res.render("landing");
});

/*===================
Auth Routes
===================*/
//Register:
router.get("/register", function(req, res){
   res.render("register");
});
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp! " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
//Login:
router.get("/login", function(req, res){
   res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you Out!");
    res.redirect("/campgrounds");
});

router.get("*", function(req,res){
    res.send("This URL Doesn't Exists");
});

module.exports = router;