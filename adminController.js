const { User } = require("./models/user");

class AdminController {
    static async getUsers(req, res) {
        try {
            const language = req.cookies.language || "ru";
            const users = await User.find();
            const admin = await User.findById(req.session?.userId);
            res.render("users", { language, users, user: admin });
        } catch (error) {
            console.error("Error getting users:", error);
            res.status(500).send("An error occurred while trying to get users");
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = req.params.id;
            await User.findByIdAndDelete(id);
            res.redirect("/admin/users");
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("An error occurred while trying to delete user");
        }
    }

    static async updateUser(req, res) {
        try {
            const id = req.params.id;
            const { name, login, role } = req.body;

            await User.findByIdAndUpdate(id, { name, login, isAdmin: role === "admin" ? true : false });
            return res.redirect("/admin/users");
        } catch (err) {
            console.error("Error updating user:", error);
            return res.status(500).send("An error occurred while trying to update user");
        }
    }

    static async editUserGet(req, res) {
        try {
            const language = req.cookies.language || "ru";
            const id = req.params.id;
            const user = await User.findById(id);
            const admin = await getCurrentUser(req);
            res.render("editUser", { us: user, user: admin, language });
        } catch (error) {
            console.error("Error getting user for edit:", error);
            res.status(500).send("An error occurred while trying to get user for edit");
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

module.exports = { AdminController };
