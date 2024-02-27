const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://vlobizon:552552Vadim@clusteraitu.ltr3eey.mongodb.net/").then(() => {
    console.log("Connected to MongoDB");
});

const { User } = require("./models/user");
const { Post } = require("./models/post");
const { AuthController } = require("./authController");
const { Middleware } = require("./middleware");
const { AdminController } = require("./adminController");
const { PostController } = require("./postController");

app.use(session({ secret: "vadimvalov", saveUninitialized: true, resave: true }));

// Post.find({ title: "Second post post" }).then((posts) => {
//     posts[0].images = [
//         "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
//         "https://img.freepik.com/free-photo/digital-painting-mountain-with-colorful-tree-foreground_1340-25699.jpg",
//         "https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?cs=srgb&dl=pexels-pixabay-355508.jpg&fm=jpg",
//     ];
//     posts[0].save();
//     console.log(posts);
// });

app.get("/", async (req, res) => {
    const language = req.cookies.language || 'ru';
    const user = await getCurrentUser(req);
    res.render("home", { user, language });
});

app.get("/login", Middleware.isAuthenticated, AuthController.loginGet);
app.get("/signup", Middleware.isAuthenticated, AuthController.registerGet);
app.post("/login", Middleware.isAuthenticated, AuthController.login);
app.post("/signup", Middleware.isAuthenticated, AuthController.register);
app.get("/logout", Middleware.isNotAuthenticated, AuthController.logout);

app.get("/admin/users", Middleware.isAdmin, AdminController.getUsers);
app.get("/admin/users/delete/:id", Middleware.isAdmin, AdminController.deleteUser);
app.get("/admin/users/edit/:id", Middleware.isAdmin, AdminController.editUserGet);
app.post("/admin/users/edit/:id", Middleware.isAdmin, AdminController.updateUser);

app.get("/posts", Middleware.isNotAuthenticated, PostController.getPosts);
app.get("/user/posts", Middleware.isNotAuthenticated, PostController.getUserPosts);
app.get("/user/posts/delete/:id", Middleware.isNotAuthenticated, PostController.deletePost);
app.get("/user/posts/add", Middleware.isNotAuthenticated, PostController.addPost);
app.get("/user/posts/edit/:id", Middleware.isNotAuthenticated, PostController.editPostGet);
app.post("/user/posts/edit/:id", Middleware.isNotAuthenticated, PostController.updatePost);

app.listen(port, "0.0.0.0", () => {
    console.log(`Сервер запущен на порту ${port}`);
});

// Utils
async function getCurrentUser(req) {
    if (!req.session?.userId) {
        return null;
    }

    const user = await User.findById(req.session?.userId);
    return user;
}

app.post('/set-language', function(req, res){
    language = req.body.language;
    console.log(language);
    res.cookie('language', req.body.language, { maxAge: 900000, httpOnly: true });
    res.redirect('back'); 
});