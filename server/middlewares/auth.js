// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  console.log("Received token:", token);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};