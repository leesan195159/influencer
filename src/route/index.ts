import { Router } from 'express';
import userrouter from './user.routes';
import filter from './filter.routes';
import searchfilterrouter from './search.routes';
import campaignrouter from './campaign.routes';
import countfilter from './count.routes';
import messagerouter from './message.routes';
import requestrouter from './request.routes';

const router = Router();

router.use('/user', userrouter);
router.use('/filter', filter);
router.use('/search', searchfilterrouter);
router.use('/campaign', campaignrouter);
router.use('/count', countfilter);
router.use('/message', messagerouter);
router.use('/request', requestrouter)


export default router;
