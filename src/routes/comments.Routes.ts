import { Router } from 'express';
import commentController from '../controllers/comments.Controllers';
import authMiddleware from '../middlewares/auth';
import roleMiddleware from '../middlewares/role';

const router = Router();

router.post('/', authMiddleware, commentController.create);
router.get('/', authMiddleware, commentController.getAll);
router.get('/:id', authMiddleware, commentController.getById);
router.put('/:id', authMiddleware, commentController.update);
router.delete('/:id', authMiddleware, commentController.delete);

export default router;
