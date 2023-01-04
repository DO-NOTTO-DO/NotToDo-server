import { Router } from 'express';
import { body } from 'express-validator';
import { missionController } from '../controllers';
import { auth } from '../middlewares';
const { validatorErrorChecker } = require('../middlewares/validator');
const router: Router = Router();

router.get('/month/:month', auth, missionController.getMissionCount);
router.get('/daily/:date', missionController.getDailyMission);
router.get('/week/:startDate', missionController.getWeeklyMissionCount);

export default router;