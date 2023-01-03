import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers';
import { auth } from '../middlewares';
const { validatorErrorChecker } = require('../middlewares/validator');
const router: Router = Router();

router.post('/', authController.signIn);

export default router;
