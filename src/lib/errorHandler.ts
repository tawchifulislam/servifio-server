import { Request, Response, NextFunction } from 'express';
import ApiError from './ApiError';
import sendResponse from './sendResponse';

export const notFoundHandler = (req: Request, res: Response) => {
  sendResponse(res, 404, {
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    sendResponse(res, err.statusCode, {
      success: false,
      message: err.message,
    });
    return;
  }

  console.error(err);

  sendResponse(res, 500, {
    success: false,
    message: 'Something went wrong',
  });
};
