import { Router } from 'express';
import { body } from 'express-validator';
import { missionController } from '../controllers';
import { auth } from '../middlewares';
const { validatorErrorChecker } = require('../middlewares/validator');
const router: Router = Router();

router.get('/month/:month', auth, missionController.getMissionCount);
router.get('/daily/:date', auth, missionController.getDailyMission);
router.get('/week/:startDate', auth, missionController.getWeeklyMissionCount);
router.get('/stat/notTodo', auth, missionController.getNotTodoStat);
router.get('/recent', auth, missionController.getRecentMissions);
router.get('/stat/notTodo', auth, missionController.getNotTodoStat);
router.get('/stat/situation', auth, missionController.getSituationStat);
router.patch('/:missionId/check', auth, missionController.changeCompletionStatus);
router.delete('/:missionId', auth, missionController.deleteMission);

export default router;
