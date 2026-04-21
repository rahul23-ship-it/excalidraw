
import { NextFunction , Request , Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from '@repo/backend-common/config' ;

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader ;
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
