const User = require("../models/userModel");
const Student = require("../models/studentModel");
const FacultyMember = require("../models/facultyMemberModel");
const { generateToken } = require("../utils/generateToken");

const authController = {
  async register(req, res) {
    try {
      const { username, password, role, name, address, academic_year } =
        req.body;
      if (!username || !password || !role || !name || !address) {
        res.json({ error: "Please provide all required fields" }).status(400);
        return;
      }
      const userExists = await User.findOne({ username });
      if (userExists) {
        res.json({ error: "User already exists" }).status(400);
        return;
      }

      let refId;
      if (role === "student") {
        if (!academic_year) {
          return res
            .json({ error: "Please provide academic year" })
            .status(400);
        }
        const student = new Student({ name, address, academic_year });
        await student.save();
        refId = student._id;
      } else if (role === "faculty") {
        const facultyMember = new FacultyMember({ name, address });
        await facultyMember.save();
        refId = facultyMember._id;
      } else {
        return res.json({ error: "Invalid role" }).status(400);
      }

      const user = new User({ username, password, role, refId });
      await user.save();
      res.json({ message: "User created successfully" }).status(201);
    } catch (err) {
      res.json({ error: "Failed to create user" + err }).status(500);
    }
  },

  async login(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res
          .status(401)
          .json({ error: "Authorization header is missing or invalid" });
      }

      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      const [username, password] = credentials.split(":");

      if (!username || !password) {
        res
          .json({
            error:
              "Please provide all required fields in the Authorization header",
          })
          .status(400);
        return;
      }
      const user = await User.findOne({ username });
      if (!user) {
        return res.json({ error: "User not found" }).status(404);
      }
      if (user.password !== password) {
        return res.json({ error: "Invalid credentials" }).status(401);
      }
      const token = generateToken(user);
      return res.json({ token }).status(200);
    } catch (err) {
      res.json({ error: "Failed to login " + err }).status(500);
    }
  },
};

module.exports = { authController };
