var express = require("express"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    methodOverride = require("method-override"),
    //new for v10
    flash = require("connect-flash");
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://watsy:Watansahu2196@@cluster0-vnpnh.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("error!",err.message);
});

app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//To create temporary campgrounds:
// var seedDB = require("./seeds");
// seedDB();


/*===================
Passport configuration
===================*/  
app.use(require("express-session")({
    secret: "Snowy is the cuttest!!",
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
   //New for V10
//   Yousing error/success variable on each and every page and the "error" message is comming from isLoggedIn() 
   res.locals.error = req.flash("error");
   res.locals.success =  req.flash("success");
   next();
});

//new for v7:
 
app.use("/campgrounds", campgroundRoutes);//writing "/campgrounds" will help to append the routes in the campground.js file with "/campgrounds"
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
//Here the use order is important :Very Important

//NOT WORKING LIKE THIS??:
/*app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);*/

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("server started!!");
});