//  to generate JWT token
import jwt from "jsonwebtoken";

export const generateToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, "secret", {
    expiresIn: "7d",
  });
};
