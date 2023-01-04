import { Router } from 'express';

import authRouter from './authRouter';
import environmentRouter from './environmentRouter';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/environment', environmentRouter);

export default router;
