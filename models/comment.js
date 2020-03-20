var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, 
        username: String
    }
    //We could keep a author id instead but it won't be efficient we have to look up for author name i.e. username in the db for each and every time and for each and every user instead we are using directly the user.
});
 
module.exports = mongoose.model("Comment", commentSchema);