import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import sendResponse from '../../lib/sendResponse';
import asyncHandler from '../../lib/asyncHandler';

const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, 200, {
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const getById = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategoryById(req.params.id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.updateCategory(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, 200, {
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.deleteCategory(req.params.id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
