import { Router } from 'express';
import { ReviewController } from '../services/review/review.controller';
import auth from '../lib/auth';

const router = Router();

router.post('/', auth('CUSTOMER'), ReviewController.create);
router.get('/service/:serviceId', ReviewController.getByService);
router.get('/:id', ReviewController.getById);
router.delete('/:id', auth('CUSTOMER', 'ADMIN'), ReviewController.remove);

export default router;
