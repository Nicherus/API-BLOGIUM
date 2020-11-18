import { Router } from 'express';

import PostsRepository from '../repositories/PostsRepository';

const postsRouter = Router();
const postsRepository = new PostsRepository();

postsRouter.post('/', (request, response) => {
	const {coverUrl, title, content};

	

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