import Router from 'koa-router';
import { sendSMSVerificationCode, checkSMSVerificationCode } from 'src/controllers/sms';

const router = new Router();

router.post('/', sendSMSVerificationCode);
router.post('/match', checkSMSVerificationCode);

export default router;
