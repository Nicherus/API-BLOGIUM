import { Router } from 'express';

const usersRouter = Router();

usersRouter.post('/sign-up', (request, response) => {
	return response.send('POST SIGN UP');
});

usersRouter.post('/sign-in', (request, response) => {
	response.status(200).send('POST SIGN IN');
});

usersRouter.get('/:id/posts', (request, response) => {
	return response.status(200).send(`GET POSTS BY USER ID${request.params.id}`);
});

usersRouter.put('/', (request, response) => {
	response.status(200).send('PUT UPDATE USER');
});


export default usersRouter;