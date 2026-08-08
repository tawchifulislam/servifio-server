import { Router } from 'express';
import { ServiceController } from '../services/service/service.controller';
import auth from '../lib/auth';

const router = Router();

router.post('/', auth('PROVIDER'), ServiceController.create);
router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getById);
router.patch('/:id', auth('PROVIDER', 'ADMIN'), ServiceController.update);
router.delete('/:id', auth('PROVIDER', 'ADMIN'), ServiceController.remove);

export default router;
