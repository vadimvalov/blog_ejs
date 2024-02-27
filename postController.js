const { Post } = require("./models/post");
const { User } = require("./models/user");

class PostController {
    static async getPosts(req, res) {
        try {
            const language = req.cookies.language || "ru";
            const posts = await Post.find().populate("createdBy");
            const user = await getCurrentUser(req);

            return res.render("posts", { posts, user, language });
        } catch (error) {
            console.error("Error getting posts:", error);
            res.status(500).send("An error occurred while trying to get posts");
        }
    }

    static async getUserPosts(req, res) {
        try {
            const language = req.cookies.language || "ru";
            const user = await getCurrentUser(req);
            const posts = await Post.find({ createdBy: user._id });

            return res.render("userposts", { posts, user, language });
        } catch (error) {
            console.error("Error getting user posts:", error);
            res.status(500).send("An error occurred while trying to get user posts");
        }
    }

    static async deletePost(req, res) {
        try {
            const id = req.params.id;

            await Post.findByIdAndDelete(id);
            res.redirect("/user/posts");
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).send("An error occurred while trying to delete post");
        }
    }

    static async addPost(req, res) {
        try {
            const user = await getCurrentUser(req);
            const { title, description, link1, link2, link3 } = req.query;

            const post = new Post({ title, description, images: [link1, link2, link3], createdBy: user._id });
            await post.save();

            res.redirect("/user/posts");
        } catch (error) {
            console.error("Error getting user for add post:", error);
            res.status(500).send("An error occurred while trying to get user for add post");
        }
    }

    static async editPostGet(req, res) {
        try {
            const language = req.cookies.language || "ru";
            const id = req.params.id;
            const post = await Post.findById(id);
            const user = await getCurrentUser(req);

            res.render("editpost", { post, user, language });
        } catch (error) {
            console.error("Error getting post for edit:", error);
            res.status(500).send("An error occurred while trying to get post for edit");
        }
    }

    static async updatePost(req, res) {
        try {
            const id = req.params.id;
            const { title, description, link1, link2, link3 } = req.body;

            await Post.findByIdAndUpdate(id, { title, description, images: [link1, link2, link3] });
            return res.redirect("/user/posts");
        } catch (error) {
            console.error("Error updating post:", error);
            return res.status(500).send("An error occurred while trying to update post");
        }
    }
}

async function getCurrentUser(req) {
    if (!req.session?.userId) {
        return null;
    }

    const user = await User.findById(req.session?.userId);
    return user;
}

module.exports = { PostController };
