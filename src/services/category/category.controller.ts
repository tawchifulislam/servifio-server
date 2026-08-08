import { Request, Response } from 'express';
import { CategoryService } from './category.service';
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

const create = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.createCategory(req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllCategories();
    sendResponse(res, 200, {
      success: true,
      message: 'Categories retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getCategoryById(
      req.params.id as string,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.updateCategory(
      req.params.id as string,
      req.body,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.deleteCategory(
      req.params.id as string,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Category deleted successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const CategoryController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
