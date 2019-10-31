var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo", { useNewUrlParser: true,  useUnifiedTopology: true });

// postSchema needs to be defined before userSchema so that it can be embedded into userSchema
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});
var Post = mongoose.model("Post", postSchema);

var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [postSchema]
});
var User = mongoose.model("User", userSchema);

// var newUser = new User({
//     email: "123@qq.com",
//     name: "Boren",
// });

// newUser.posts.push({
//     title: "Great Course!",
//     content: "This course really help me a lot!"
// });

// newUser.save(function(err, user){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });

User.findOne({name: "Boren"}, function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
        // push and save
        user.posts.push({
            title: "Great Course!",
            content: "This course really help me a lot!"
        });
        user.save(function(err, user){
            if(err){
                console.log(err);
            } else {
                console.log(user);
            }
        });
    }
});
