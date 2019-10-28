var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("landing")
});

app.get("/places", function(req, res){
    var places = [{name:"a", image:"http://www.jtdashiell.com/_assets/images/home-projects/south-hampton-lg.jpg"},
    {name:"a", image:"http://www.jtdashiell.com/_assets/images/home-projects/south-hampton-lg.jpg"},
    {name:"a", image:"http://www.jtdashiell.com/_assets/images/home-projects/south-hampton-lg.jpg"}]
    res.render("places", {places:places}) 
});

app.post("/places", function(req, res){
    // get data from form and add
    var name = req.body.name
    var image = req.body.image
    // redirect back to places page
    res.redirect("/places");
});

app.get("/places/new", function(req, res){
    res.render("new");
});

app.listen(5000, process.env.IP, function(){
    console.log("YelpLongIsland Has Started!")
});