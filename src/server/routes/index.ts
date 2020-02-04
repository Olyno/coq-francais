import * as Router from '@koa/router';
import user from './user';

const router = new Router();

router.use(user.routes());

export default router.routes();