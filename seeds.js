var mongoose = require("mongoose");
var Place = require("./models/place");
var Comment = require("./models/comment");

var data =[
    {
        name: "Warm Breeze",
        image: "http://www.hotel-r.net/im/hotel/caribbean/do/ocean-breeze-4.jpg",
        description: "Warm ass breeze dawg."
    },
    {
        name: "Matterhorn's Rest",
        image: "http://cdn3.list25.com/wp-content/uploads/2015/06/2523-610x360.jpg",
        description: "Only for the mentally challenged"
    },
    {
        name: "Ascent of Death",
        image: "http://cdn1.theeventchronicle.com/wp-content/uploads/2015/05/volcanic-ring-of-fire.jpg",
        description: "For the clinically insane"
    }
]

function seedDB(){
    // Remove all places
    Place.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed all places");
            // Add a few places
            data.forEach(function(seed){
                Place.create(seed, function(err, place){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("added a place");
                        Comment.create({
                            text: "This place is great, but I wish I had internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                place.comments.push(comment);
                                place.save(function(err){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        console.log("Create a new comment")
                                    }
                                });
                            }
                        });
                    }
                })
            });
        }
    });    
}

module.exports = seedDB; 

