const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    login: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
