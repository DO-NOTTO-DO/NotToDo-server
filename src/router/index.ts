import { Router } from 'express';

import authRouter from './authRouter';
import environmentRouter from './environmentRouter';
import situationRouter from './situationRouter'

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/environment', environmentRouter);
router.use('/situation', situationRouter)

export default router;
