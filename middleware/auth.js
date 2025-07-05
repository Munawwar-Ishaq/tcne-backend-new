const jwt = require("jsonwebtoken");
const { verifyToken } = require("../config/helper");

const auth = (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    if (token) {
      let decoded = verifyToken(token);
      console.log("data", decoded);
      if (decoded) {
        req.headers["userData"] = decoded?.data;
        next();
      } else {
        return res.status(401).json({ error: "Token Expired." });
      }
    } else {
      return res.status(401).json({ error: "Invalid token." });
    }
  } else {
    return res.status(401).json({ error: "Authorization token is required." });
  }
};

module.exports = auth;
