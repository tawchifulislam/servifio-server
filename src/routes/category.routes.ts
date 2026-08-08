import { Router } from 'express';
import { CategoryController } from '../services/category/category.controller';
import auth from '../lib/auth';

const router = Router();

router.post('/', auth('ADMIN'), CategoryController.create);
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.patch('/:id', auth('ADMIN'), CategoryController.update);
router.delete('/:id', auth('ADMIN'), CategoryController.remove);

export default router;
