import { Router } from 'express';
import { UserController } from '../services/user/user.controller';
import auth from '../lib/auth';

const router = Router();

router.get('/', auth('ADMIN'), UserController.getAll);
router.patch('/:id/status', auth('ADMIN'), UserController.toggleStatus);

export default router;
