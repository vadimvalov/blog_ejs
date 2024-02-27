class Middleware {
    static async isAuthenticated(req, res, next) {
        if (req.session?.userId) {
            return res.redirect("/");
        }

        next();
    }

    static async isAdmin(req, res, next) {
        console.log(req);
        if (req.session.isAdmin) {
            return next();
        }

        res.redirect("/");
    }

    static async isNotAuthenticated(req, res, next) {
        if (!req.session?.userId) {
            return res.redirect("/login");
        }

        next();
    }
}

module.exports = { Middleware };
