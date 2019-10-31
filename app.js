var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Place = require("./models/place"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_long_island", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res){
    res.render("landing")
});

app.get("/places", function(req, res){
    // get all places from DB
    Place.find({}, function(err, places){
        if(err){
            console.log(err);
        } else {
            res.render("places/index", {places:places})
        }
    })
});

app.post("/places", function(req, res){
    // get data from the form
    var name = req.body.name
    var image = req.body.image 
    var description = req.body.description 
    var newPlace = {name: name, image: image, description: description};
    // create a new place and save to DB
    Place.create(newPlace, function(err, place){
        if(err){
            console.log(err);
        } else {
            // redirect back to places page
            res.redirect("/places");
        }
    });
});

app.get("/places/new", function(req, res){
    res.render("places/new");
});

app.get("/places/:id", function(req, res){
    // find the place with provided ID
    Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace){
        if(err){
            console.log(err);
        }else{
            console.log(foundPlace);
            // render show template with that place
            res.render("places/show", {place: foundPlace});
        }
    });
});


app.get("/places/:id/comments/new", function(req, res){
    //find campground by id
    Place.findById(req.params.id, function(err, place){
        if(err){
             console.log(err);
        } else {
             res.render("comments/new", {place: place});
        } 
     });
});

app.post("/places/:id/comments", function(req, res){
    // look up campground using ID
    Place.findById(req.params.id, function(err, place){
        if(err){
            console.log(err);
            res.redirect("/places");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);          
                } else {
                    place.comments.push(comment);
                    place.save();
                    res.redirect("/places/" + place._id);
                }
            });
        }
    });
});

app.listen(5000, process.env.IP, function(){
    console.log("YelpLongIsland Has Started!")
});