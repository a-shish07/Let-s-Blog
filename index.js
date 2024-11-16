const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
// const mongoose = require('mongoose');
// console.log(mongoose.Types.ObjectId.isValid('6738c592bbe31465586e77fe')); // Should return true

const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthCookie } = require("./middlewares/auth");
const Blog = require("./models/blog");

const app = express(); 
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogy').then(e=>{
    console.log("MongoDB Connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get('/', async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);


app.listen(PORT, () =>{
    console.log(`Server started at PORT: ${PORT}`)
});