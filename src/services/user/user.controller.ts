import { Request, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../lib/sendResponse';
import ApiError from '../../lib/ApiError';

const handleError = (res: Response, error: unknown) => {
  if (error instanceof ApiError) {
    sendResponse(res, error.statusCode, {
      success: false,
      message: error.message,
    });
  } else {
    sendResponse(res, 500, {
      success: false,
      message: 'Something went wrong',
    });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const result = await UserService.registerUser(req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await UserService.loginUser(req.body);
    sendResponse(res, 200, {
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllUsers();
    sendResponse(res, 200, {
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const toggleStatus = async (req: Request, res: Response) => {
  try {
    const result = await UserService.toggleUserStatus(req.params.id as string);
    sendResponse(res, 200, {
      success: true,
      message: 'User status updated successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const UserController = {
  register,
  login,
  getAll,
  toggleStatus,
};
