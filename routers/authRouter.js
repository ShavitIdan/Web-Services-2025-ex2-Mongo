const { Router } = require("express");
const { authController } = require("../controllers/authController");

const authRouter = new Router();

authRouter.get("/login", authController.login);
authRouter.post("/register", authController.register);

module.exports = { authRouter };
