import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    return res.status(401).json({ errors: "Invalid token" });
  }
}
export default userMiddleware;
