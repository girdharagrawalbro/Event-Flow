//  middleware for authentication by JWT token
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "secret" );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};

export const organizerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "organizer") {
    res.status(403).json({ message: "Only organizers allowed" });
    return;
  }
  next();
};
