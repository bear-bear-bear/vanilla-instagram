import Router from 'koa-router';
import { verifyExistenceUsername, createUser } from 'src/controllers/user';

const router = new Router();

router.get('/:username/exist', verifyExistenceUsername);
router.post('/', createUser);

export default router;
