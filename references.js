var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo_3", { useNewUrlParser: true,  useUnifiedTopology: true });

var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
var User = mongoose.model("User", userSchema);

var postSchema = new mongoose.Schema({
    title: String,
    content: String
});
var Post = mongoose.model("Post", postSchema);

User.create({
    email: "123@qq.com",
    name: "Boren"
});

Post.create({
    title: "Great Course!!!!",
    content: "This course really help me a lot!!!"
}, function(err, post){
    if(err){
        console.log(err)
    }
    User.findOne({email: "123@qq.com"}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            foundUser.posts.push(post);
            foundUser.save(function(err, user){
                if(err){
                    console.log(err);
                } else {
                    console.log(user);
                }
            });
        }
    });
});

// find all posts for a user
User.findOne({email: "123@qq.com"}).populate("posts").exec(function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});