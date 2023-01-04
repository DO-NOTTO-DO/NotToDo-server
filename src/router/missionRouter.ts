import { Router } from 'express';
import { body } from 'express-validator';
import { missionController } from '../controllers';
import { auth } from '../middlewares';
const { validatorErrorChecker } = require('../middlewares/validator');
const router: Router = Router();

router.get('/daily/:date', missionController.getDailyMission);

export default router;
