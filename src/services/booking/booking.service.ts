import prisma from '../../lib/prisma';
import ApiError from '../../lib/ApiError';

interface CreateBookingInput {
  serviceId: string;
  scheduledDate: string;
  note?: string;
}

type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

const createBooking = async (
  customerId: string,
  payload: CreateBookingInput,
) => {
  const service = await prisma.service.findUnique({
    where: { id: payload.serviceId },
  });

  if (!service || service.isDeleted || service.status !== 'ACTIVE') {
    throw new ApiError(404, 'Service not available');
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      serviceId: payload.serviceId,
      scheduledDate: new Date(payload.scheduledDate),
      note: payload.note ?? null,
    },
  });

  return booking;
};

const getMyBookings = async (userId: string, role: string) => {
  if (role === 'PROVIDER') {
    return prisma.booking.findMany({
      where: { isDeleted: false, service: { providerId: userId } },
      include: {
        service: true,
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return prisma.booking.findMany({
    where: { isDeleted: false, customerId: userId },
    include: { service: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getBookingById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      customer: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!booking || booking.isDeleted) {
    throw new ApiError(404, 'Booking not found');
  }

  return booking;
};

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['COMPLETED', 'CANCELLED'],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

const updateBookingStatus = async (
  id: string,
  requesterId: string,
  requesterRole: string,
  newStatus: BookingStatus,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!booking || booking.isDeleted) {
    throw new ApiError(404, 'Booking not found');
  }

  const isOwner = booking.service.providerId === requesterId;
  const isCustomer = booking.customerId === requesterId;

  if (!isOwner && !isCustomer && requesterRole !== 'ADMIN') {
    throw new ApiError(
      403,
      'You do not have permission to update this booking',
    );
  }

  if (
    newStatus === 'CANCELLED' &&
    !isCustomer &&
    !isOwner &&
    requesterRole !== 'ADMIN'
  ) {
    throw new ApiError(403, 'Only the customer or provider can cancel');
  }

  const allowedNextStatuses =
    VALID_TRANSITIONS[booking.status as BookingStatus];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change status from ${booking.status} to ${newStatus}`,
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: newStatus },
  });

  return updated;
};

const deleteBooking = async (
  id: string,
  requesterId: string,
  requesterRole: string,
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking || booking.isDeleted) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.customerId !== requesterId && requesterRole !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete your own bookings');
  }

  const deleted = await prisma.booking.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};
