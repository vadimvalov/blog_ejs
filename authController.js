const { User } = require("./models/user");
const bcrypt = require("bcrypt");

class AuthController {
    static async login(req, res) {
        try {
            const { login, password } = req.body;

            const user = await User.findOne({ login });

            if (!user) {
                return res.render("login", { user: null, error: "User with this login does not exist", success: false });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.render("login", { user: null, error: "Invalid password", success: false });
            }

            req.session.userId = user._id;
            req.session.isAdmin = user.isAdmin;

            return res.redirect("/");
        } catch (error) {
            console.log("Error logging in:", error);
            return res.render("login", { user: null, error: "An error occurred while trying to log in", success: false });
        }
    }

    static async register(req, res) {
        try {
            const { name, login, password } = req.body;

            const existingUser = await User.findOne({ login });
            if (existingUser) {
                return res.render("register", { user: null, error: "User with this login already exists", success: false });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ name, login, password: hashedPassword });

            await newUser.save();
            return res.render("login", { user: null, error: null, success: "You have been registered successfully!" });
        } catch (error) {
            console.log("Error registering:", error);
            return res.render("register", { user: null, error: "An error occurred while trying to register", success: false });
        }
    }

    static async loginGet(req, res) {
        res.render("login", { user: null, error: null, success: false });
    }

    static async registerGet(req, res) {
        res.render("register", { user: null, error: null, success: false });
    }

    static async logout(req, res) {
        req.session.destroy();
        res.redirect("/");
    }
}

module.exports = { AuthController };
