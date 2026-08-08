import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../generated/prisma/enums';
import ApiError from './ApiError';
import sendResponse from './sendResponse';

const JWT_SECRET = process.env.JWT_SECRET as string;

const auth = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'You are not authorized');
      }

      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token as string, JWT_SECRET) as {
        userId: string;
        role: Role;
      };

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        throw new ApiError(
          403,
          'You do not have permission to perform this action',
        );
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        sendResponse(res, error.statusCode, {
          success: false,
          message: error.message,
        });
      } else {
        sendResponse(res, 401, {
          success: false,
          message: 'Invalid or expired token',
        });
      }
    }
  };
};

export default auth;
