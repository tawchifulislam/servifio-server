import prisma from '../../lib/prisma';
import ApiError from '../../lib/ApiError';

interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
}

const createReview = async (customerId: string, payload: CreateReviewInput) => {
  if (payload.rating < 1 || payload.rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
  });

  if (!booking || booking.isDeleted) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.customerId !== customerId) {
    throw new ApiError(403, 'You can only review your own bookings');
  }

  if (booking.status !== 'COMPLETED') {
    throw new ApiError(400, 'You can only review a completed booking');
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId },
  });

  if (existingReview) {
    throw new ApiError(409, 'You have already reviewed this booking');
  }

  const review = await prisma.review.create({
    data: {
      bookingId: payload.bookingId,
      customerId,
      serviceId: booking.serviceId,
      rating: payload.rating,
      comment: payload.comment ?? null,
    },
  });

  return review;
};

const getReviewsByService = async (serviceId: string) => {
  const reviews = await prisma.review.findMany({
    where: { serviceId, isDeleted: false },
    include: {
      customer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews;
};

const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true } },
      service: true,
    },
  });

  if (!review || review.isDeleted) {
    throw new ApiError(404, 'Review not found');
  }

  return review;
};

const deleteReview = async (
  id: string,
  requesterId: string,
  requesterRole: string,
) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review || review.isDeleted) {
    throw new ApiError(404, 'Review not found');
  }

  if (review.customerId !== requesterId && requesterRole !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete your own review');
  }

  const deleted = await prisma.review.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const ReviewService = {
  createReview,
  getReviewsByService,
  getReviewById,
  deleteReview,
};
