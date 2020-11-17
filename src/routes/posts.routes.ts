import { Router } from 'express';

const postsRouter = Router();

postsRouter.post('/', (request, response) => {
	return response.send('POST POST');
});

postsRouter.get('/', (request, response) => {
	return response.send('GET POSTS');
});

postsRouter.get('/:id', (request, response) => {
	return response.status(200).send(`GET POSTS BY POST ID${request.params.id}`);
});

postsRouter.put('/:id', (request, response) => {
	return response.status(200).send(`PUT UPDATE POSTS BY POST ID${request.params.id}`);
});

postsRouter.delete('/:id', (request, response) => {
	return response.status(200).send(`DELETE POSTS BY POST ID${request.params.id}`);
});

export default postsRouter;