import { Router } from 'express';
import { auth } from '../middlewares';
import { bannerController } from '../controllers';

const router: Router = Router();

router.get('/', auth, bannerController.getBanner);

export default router;
