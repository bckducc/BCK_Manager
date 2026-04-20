const jwt = require("jsonwebtoken");

const SECRET = "SECRET_KEY";

exports.signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    SECRET,
    { expiresIn: "7d" }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};