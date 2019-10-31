var mongoose = require("mongoose");

// SCHEMA SETUP
var placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Place = mongoose.model("Place", placeSchema);
module.exports = Place;