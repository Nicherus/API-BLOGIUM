import { getUserData } from './users.routes';
import { Router } from 'express';

import PostsRepository from '../repositories/PostsRepository';

const postsRouter = Router();
const postsRepository = new PostsRepository();

postsRouter.post('/', (request, response) => {
	const {coverUrl, title, content} = request.body;

	const validation = postsRepository.validatePost(coverUrl, title, content);
	const { error } = validation;

	if(error == null){
		const post = postsRepository.createPost(coverUrl, title, content, 1);
		console.log(post);
		const user = getUserData();
		
		const postData = {
			'id': post.id,
			'title': post.title,
			'coverUrl': post.coverUrl,
			'content': post.content,
			'publishedAt': post.publishedAt,
			'author': {
				'id': post.authorId,
				'username': user.username,
				'avatarUrl': user.avatarUrl,
				'biography': user.biography,
			}
		};
		return response.status(201).send(postData);
	} else{
		return response.status(422).send('Oops! Please, check the data you are sending.');
	}
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