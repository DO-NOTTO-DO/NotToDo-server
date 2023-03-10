import { Router } from 'express';
import situationController from '../controllers/situationController';
import { auth } from '../middlewares';
const router: Router = Router();

router.get('/', auth, situationController.getSituation);

export default router;
