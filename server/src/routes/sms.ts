import Router from 'koa-router';
import { sendSMSCode, checkSMSCode } from 'src/controllers/sms';

const router = new Router();

router.post('/', sendSMSCode);
router.post('/match', checkSMSCode);

export default router;
