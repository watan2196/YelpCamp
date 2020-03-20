var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {   name: "Night view",
        image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        description: "what a view"
    },
    {   name: "camp under the sky",
        image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg",
        description: "whanna visit??"
    },
    {   name: "3 moon camps",
        image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg",
        description: "The camp with magic"
    }
] ;

function seedDB(){
    //remove all camgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!"); 
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err)
                    console.log(err);
                else{
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but i wish there was internet",
                            author: "Homer"
                        },  function(err, comment){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    // console.log(comment);
                                }
                            }
                    );
                }  
            });
        });    
    });

}
// same as seedDB without ()
module.exports = seedDB;

