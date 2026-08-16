import { Request, Response } from 'express';
import { ServiceModuleService } from './service.service';
import sendResponse from '../../lib/sendResponse';
import asyncHandler from '../../lib/asyncHandler';

const create = asyncHandler(async (req: Request, res: Response) => {
  const providerId = req.user!.userId;
  const result = await ServiceModuleService.createService(providerId, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await ServiceModuleService.getAllServices();
  sendResponse(res, 200, {
    success: true,
    message: 'Services retrieved successfully',
    data: result,
  });
});

const getById = asyncHandler(async (req: Request, res: Response) => {
  const result = await ServiceModuleService.getServiceById(
    req.params.id as string,
  );
  sendResponse(res, 200, {
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const requesterId = req.user!.userId;
  const requesterRole = req.user!.role;
  const result = await ServiceModuleService.updateService(
    req.params.id as string,
    requesterId,
    requesterRole,
    req.body,
  );
  sendResponse(res, 200, {
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const requesterId = req.user!.userId;
  const requesterRole = req.user!.role;
  const result = await ServiceModuleService.deleteService(
    req.params.id as string,
    requesterId,
    requesterRole,
  );
  sendResponse(res, 200, {
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const ServiceController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
