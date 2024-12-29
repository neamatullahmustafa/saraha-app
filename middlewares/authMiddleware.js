import jwt from "jsonwebtoken";
import User from "../features/auth/auth.model.js";

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  const JWT_SECRET = "neama123";
  if (!token) return res.status(403).json({ message: "Token is required!" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export { verifyToken };
