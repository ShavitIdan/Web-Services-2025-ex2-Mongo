const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.json({ error: "Access token is missing" }).status(401);
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next;
  } catch (err) {
    res.json({ error: "Invalid or expired token" }).status(403);
  }
};
