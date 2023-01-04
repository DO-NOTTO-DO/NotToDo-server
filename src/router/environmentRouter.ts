import { Router } from 'express';
import { body } from 'express-validator';
import { environmentController } from '../controllers';
import { auth } from '../middlewares';
const { validatorErrorChecker } = require('../middlewares/validator');
const router: Router = Router();

router.get('/category', environmentController.getCategory);

export default router;
