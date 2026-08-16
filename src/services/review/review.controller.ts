import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import sendResponse from '../../lib/sendResponse';
import asyncHandler from '../../lib/asyncHandler';

const create = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.user!.userId;
  const result = await ReviewService.createReview(customerId, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getByService = asyncHandler(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewsByService(
    req.params.serviceId as string,
  );
  sendResponse(res, 200, {
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const getById = asyncHandler(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewById(req.params.id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
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
});

export const ReviewController = {
  create,
  getByService,
  getById,
  remove,
};
