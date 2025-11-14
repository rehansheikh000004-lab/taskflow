import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const header = req.header("Authorization");
    if (!header) return res.status(401).json({ message: "No token" });
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
