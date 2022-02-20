const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Please Login first",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Not authourized",
      });
    }

    req.user = await User.findById({ _id: decoded._id });
    next();
  } catch (error) {
    console.log(error);
  }
};
