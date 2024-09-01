import express from 'express';
import userController from '../controllers/users.Controllers';
import validateSchema from '../middlewares/validate';
import userSchema from '../schemas/users.Schemas';
import authMiddleware from '../middlewares/auth';
import roleMiddleware from '../middlewares/role'; 

const router = express.Router();

// Crear usuario
router.post('/', 
    authMiddleware, 
 
    roleMiddleware(['superadmin'])
, 
    validateSchema(userSchema), 
    userController.create
);

router.get('/', authMiddleware, userController.getAll);

router.get('/:id', authMiddleware, userController.getById);

router.put('/:id', 
    authMiddleware, 
    validateSchema(userSchema), 
    userController.update
);

router.delete('/:id', 
    authMiddleware, 
    roleMiddleware(['superadmin']), 
    userController.delete
);

router.post('/register', validateSchema(userSchema), userController.register); 

router.post('/login', userController.login);

export default router;