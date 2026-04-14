const jwt = require("jsonwebtoken");

function authMiddleware(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;

  const token = header.replace("Bearer ", "").trim();
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = authMiddleware;