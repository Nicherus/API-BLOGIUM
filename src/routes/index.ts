import { Router } from 'express';
import usersRouter from './users.routes';
import postsRouter from './posts.routes';

const routes = Router();

routes.use('/api/users', usersRouter);
routes.use('/api/posts', postsRouter);

export default routes;