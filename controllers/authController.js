const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");
const { studentsController } = require("./studentsController");
const { facultyMembersController } = require("./facultyMembersController");

const authController = {
  async register(req, res) {
    try {
      const { username, password, role, name, address, academic_year } =
        req.body;
      if (!username || !password || !role || !name || !address) {
        return res.status(400).json({
          success: false,
          error: "Please provide all required fields",
        });
        return;
      }
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({
          success: false,
          error: "User already exists",
        });
      }

      let refId;
      if (role === "Student") {
        if (!academic_year) {
          return res.status(400).json({
            success: false,
            error: "Please provide academic year",
          });
        }
        const student = await studentsController.addStudent({
          name,
          address,
          academic_year,
        });

        refId = student._id;
      } else if (role === "FacultyMember") {
        const facultyMember = await facultyMembersController.addFacultyMember({
          name,
          address,
        });
        refId = facultyMember._id;
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid role",
        });
      }

      const user = new User({ username, password, role, refId });
      await user.save();
      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to create user",
        details: err.message,
      });
    }
  },

  async login(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).json({
          success: false,
          error: "Authorization header is missing or invalid",
        });
      }

      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      const [username, password] = credentials.split(":");

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error:
            "Please provide all required fields in the Authorization header",
        });
      }
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }
      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        token,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to login",
        details: err.message,
      });
    }
  },
};

module.exports = { authController };
