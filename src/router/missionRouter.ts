import { Router } from 'express';
import { body, check } from 'express-validator';
import { missionController } from '../controllers';
import { auth } from '../middlewares';
const { validatorErrorChecker } = require('../middlewares/validator');
const router: Router = Router();

router.get('/month/:month', auth, missionController.getMissionCount);
router.get('/daily/:date', auth, missionController.getDailyMission);
router.get('/week/:startDate', auth, missionController.getWeeklyMissionCount);
router.get('/recent', auth, missionController.getRecentMissions);
router.get('/stat/notTodo', auth, missionController.getNotTodoStat);
router.get('/stat/situation', auth, missionController.getSituationStat);
router.post(
  '/',
  [check('title').notEmpty(), check('situation').notEmpty(), check('actionDate').notEmpty(), check('goal').notEmpty(), check('actions').notEmpty()],
  validatorErrorChecker,
  auth,
  missionController.postMission,
);
router.post('/:missionId', auth, missionController.postMissionOtherDates);
router.patch('/:missionId/check', auth, missionController.changeCompletionStatus);
router.delete('/:missionId', auth, missionController.deleteMission);

export default router;
