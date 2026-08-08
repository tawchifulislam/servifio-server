import { Request, Response } from 'express';
import { ReviewService } from './review.service';
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
    const customerId = req.user!.userId;
    const result = await ReviewService.createReview(customerId, req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getByService = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getReviewsByService(
      req.params.serviceId as string,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Reviews retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getReviewById(req.params.id as string);
    sendResponse(res, 200, {
      success: true,
      message: 'Review retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user!.userId;
    const requesterRole = req.user!.role;
    const result = await ReviewService.deleteReview(
      req.params.id as string,
      requesterId,
      requesterRole,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Review deleted successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const ReviewController = {
  create,
  getByService,
  getById,
  remove,
};
