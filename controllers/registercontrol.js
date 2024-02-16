const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

const renderRegisterForm = (req, res) => {
    res.render("register");
};

const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, username } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
            return res.status(403).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserData = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            username,
        };

        const newUser = await User.create(newUserData);
        const token = await getToken(email, newUser);
        const userToReturn = { ...newUser.toJSON(), token };

        delete userToReturn.password;

        res.render('login');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    renderRegisterForm,
    registerUser,
};