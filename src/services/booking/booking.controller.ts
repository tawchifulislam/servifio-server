import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import sendResponse from '../../lib/sendResponse';
import asyncHandler from '../../lib/asyncHandler';

const create = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.user!.userId;
  const result = await BookingService.createBooking(customerId, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getMine = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const role = req.user!.role;
  const result = await BookingService.getMyBookings(userId, role);
  sendResponse(res, 200, {
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const getById = asyncHandler(async (req: Request, res: Response) => {
  const result = await BookingService.getBookingById(req.params.id as string);
  sendResponse(res, 200, {
    success: true,
    message: 'Booking retrieved successfully',
    data: result,
  });
});

const updateStatus = asyncHandler(async (req: Request, res: Response) => {
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
});

const remove = asyncHandler(async (req: Request, res: Response) => {
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
});

export const BookingController = {
  create,
  getMine,
  getById,
  updateStatus,
  remove,
};
