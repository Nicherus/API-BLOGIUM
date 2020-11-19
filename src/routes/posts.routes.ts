import { getUserData, getLoggedUserData } from './users.routes';
import { Router } from 'express';

import PostsRepository from '../repositories/PostsRepository';
import Post from 'src/models/Posts';

const postsRouter = Router();
const postsRepository = new PostsRepository();

postsRouter.post('/', (request, response) => {
	const {coverUrl, title, content} = request.body;

	const validation = postsRepository.validatePost(coverUrl, title, content);
	const { error } = validation;

	if(error == null){
		const post = postsRepository.createPost(coverUrl, title, content, 1);
		const user = getLoggedUserData();
		
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
	const { offset, limit} = request.query;
	const posts = JSON.parse(JSON.stringify(postsRepository.getPosts()));
	let constructedPosts = posts.map((p: Post) => {
		const author = getUserData(p.authorId);
		p.author = {
			'id': author.id,
			'username': author.username,
			'avatarUrl': author.avatarUrl,
			'biography': author.biography,
		};
		return p;
	});
	constructedPosts = constructedPosts.slice(offset, limit); 
	return response.status(201).send({
		'count': constructedPosts.length,
		'posts': [...constructedPosts],
	});
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