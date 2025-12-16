const User = require("../models/User");
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        const token = user.createJWT();
        res.status(201).json({ user: { name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = user.createJWT();
        res.status(200).json({ user: { name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { register, login };