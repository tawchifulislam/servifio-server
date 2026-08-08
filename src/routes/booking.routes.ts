import { Router } from 'express';
import { BookingController } from '../services/booking/booking.controller';
import auth from '../lib/auth';

const router = Router();

router.post('/', auth('CUSTOMER'), BookingController.create);
router.get(
  '/my-bookings',
  auth('CUSTOMER', 'PROVIDER', 'ADMIN'),
  BookingController.getMine,
);
router.get(
  '/:id',
  auth('CUSTOMER', 'PROVIDER', 'ADMIN'),
  BookingController.getById,
);
router.patch(
  '/:id/status',
  auth('CUSTOMER', 'PROVIDER', 'ADMIN'),
  BookingController.updateStatus,
);
router.delete('/:id', auth('CUSTOMER', 'ADMIN'), BookingController.remove);

export default router;
