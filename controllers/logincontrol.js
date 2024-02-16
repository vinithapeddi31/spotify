const User = require("../models/User");
const Song = require("../models/Song");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

const renderLoginForm = (req, res) => {
    res.render("login");
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(403).json({ error: "Invalid login credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid login credentials" });
        }

        const token = await getToken(email, user);
        const userToReturn = { ...user.toJSON(), token };

        delete userToReturn.password;

        const songs = await Song.find({}, '_id name artist audioUrl thumbnailUrl');

        res.render('home', { username: userToReturn.firstName, songs: songs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    renderLoginForm,
    loginUser,
};