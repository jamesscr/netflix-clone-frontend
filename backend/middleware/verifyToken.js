const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentification échouée!" });
  }
};

exports.isAdmin = async (req, res, next) => {
  const { user } = req;
  if (user.role === "admin") next();
  else
    return res.json({
      success: false,
      message: "Unauthorized access!",
      from: "isAdmin",
    });
};
