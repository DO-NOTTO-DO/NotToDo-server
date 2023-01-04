import { Router } from 'express';
import authRouter from './authRouter';
import environmentRouter from './environmentRouter';
import missionRouter from './missionRouter';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/environment', environmentRouter);
router.use('/mission', missionRouter);

export default router;
