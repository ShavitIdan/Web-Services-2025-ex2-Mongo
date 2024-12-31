const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");

const authController = {
  async register(req, res) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        res.json({ error: "Please provide all required fields" }).status(400);
        return;
      }
      const userExists = await User.findOne({ username });
      if (userExists) {
        res.json({ error: "User already exists" }).status(400);
        return;
      }

      const user = new User({ username, password, role });
      await user.save();
      res.json({ message: "User created successfully" }).status(201);
    } catch (err) {
      res.json({ error: "Failed to create user" }).status(500);
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.json({ error: "Please provide all required fields" }).status(400);
        return;
      }
      const user = await User.findOne({ username });
      if (!user) {
        res.json({ error: "User not found" }).status(404);
        return;
      }
      if (user.password !== password) {
        res.json({ error: "Invalid credentials" }).status(401);
        return;
      }
      const token = generateToken(user._id);
      res.json({ token }).status(200);
    } catch (err) {
      res.json({ error: "Failed to login " + err }).status(500);
    }
  },
};

module.exports = { authController };
