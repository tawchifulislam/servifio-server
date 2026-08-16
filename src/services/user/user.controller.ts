import { Request, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../lib/sendResponse';
import asyncHandler from '../../lib/asyncHandler';

const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.registerUser(req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.loginUser(req.body);
  sendResponse(res, 200, {
    success: true,
    message: 'Login successful',
    data: result,
  });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, 200, {
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const toggleStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.toggleUserStatus(req.params.id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

export const UserController = {
  register,
  login,
  getAll,
  toggleStatus,
};
