const authorizeRole = (role) => {
  return (req, res, next) => {
    console.log("User Role:", req.user.role);
    if (req.user.role !== role) {
      return res
        .json({ error: "Access denied: insufficient permissions" })
        .status(403);
    }
    next();
  };
};

module.exports = { authorizeRole };
