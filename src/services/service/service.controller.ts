import { Request, Response } from 'express';
import { ServiceModuleService } from './service.service';
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
    const providerId = req.user!.userId;
    const result = await ServiceModuleService.createService(
      providerId,
      req.body,
    );
    sendResponse(res, 201, {
      success: true,
      message: 'Service created successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await ServiceModuleService.getAllServices();
    sendResponse(res, 200, {
      success: true,
      message: 'Services retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const result = await ServiceModuleService.getServiceById(
      req.params.id as string,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Service retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    handleError(res, error);
  }
};

export const ServiceController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
