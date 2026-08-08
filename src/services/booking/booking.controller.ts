import { Request, Response } from 'express';
import { BookingService } from './booking.service';
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
    const result = await BookingService.createBooking(customerId, req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'Booking created successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getMine = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const result = await BookingService.getMyBookings(userId, role);
    sendResponse(res, 200, {
      success: true,
      message: 'Bookings retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.getBookingById(req.params.id as string);
    sendResponse(res, 200, {
      success: true,
      message: 'Booking retrieved successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const updateStatus = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user!.userId;
    const requesterRole = req.user!.role;
    const { status } = req.body;
    const result = await BookingService.updateBookingStatus(
      req.params.id as string,
      requesterId,
      requesterRole,
      status,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Booking status updated successfully',
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
    const result = await BookingService.deleteBooking(
      req.params.id as string,
      requesterId,
      requesterRole,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Booking deleted successfully',
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const BookingController = {
  create,
  getMine,
  getById,
  updateStatus,
  remove,
};
