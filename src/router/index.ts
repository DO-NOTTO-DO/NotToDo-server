import { Router } from 'express';
import authRouter from './authRouter';
import bannerRouter from './bannerRouter';
import environmentRouter from './environmentRouter';
import missionRouter from './missionRouter';
import situationRouter from './situationRouter'

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/environment', environmentRouter);
router.use('/mission', missionRouter);
router.use('/situation', situationRouter);
router.use('/banner', bannerRouter);

export default router;
