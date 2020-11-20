import { getUserData, getLoggedUserData } from './users.routes';
import { Router } from 'express';

import PostsRepository from '../repositories/PostsRepository';
import Post from 'src/models/Posts';

const postsRouter = Router();
const postsRepository = new PostsRepository();

export const getPosts = () : Post[] => {
	return postsRepository.getPosts();
};

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

		return response.status(201).json(postData);
	} else{
		return response.status(422).send('Oops! Please, check the data you are sending.');
	}
});

postsRouter.get('/', (request, response) => {
	const { offset, limit} = request.query;
	const posts = JSON.parse(JSON.stringify(postsRepository.getPosts()));
	let constructedPosts = posts.map((p: Post) => {
		const author = getUserData(p.authorId);
		delete p.authorId;
		delete p.content;
		p.author = {
			'id': author.id,
			'username': author.username,
			'avatarUrl': author.avatarUrl,
			'biography': author.biography,
		};
		return p;
	});
	constructedPosts = constructedPosts.slice(offset, limit); 
	return response.status(200).json({
		'count': constructedPosts.length,
		'posts': [...constructedPosts],
	});
});

postsRouter.get('/:id', (request, response) => {
	const posts = JSON.parse(JSON.stringify(getPosts()));
	const post = posts.filter((p: Post) => p.id === JSON.parse(request.params.id));
	const author = getUserData(post[0].authorId);
	delete post[0].authorId;
	delete post[0].contentPreview;
	return response.status(200).json({
		...post[0],
		'author': {
			'id': author.id,
			'username': author.username,
			'avatarUrl': author.avatarUrl,
			'biography': author.biography,
		}
	});
});

postsRouter.put('/:id', (request, response) => {
	const {coverUrl, title, content} = request.body;
	const posts = JSON.parse(JSON.stringify(getPosts()));
	const postId = JSON.parse(request.params.id);
	const post = posts.filter((p: Post) => p.id === postId);
	const validation = postsRepository.validatePost(coverUrl, title, content);
	const { error } = validation;
	const loggedUser = getLoggedUserData();
	
	if(post[0].authorId !== loggedUser.id){
		return response.status(401).send('Oops! Check your credentials.');
	} else if(error == null){
		const postData = {
			'id': post.id,
			'title': title,
			'coverUrl': coverUrl,
			'content': content,
			'publishedAt': post.publishedAt,
			'author': {
				'id': post.authorId,
				'username': loggedUser.username,
				'avatarUrl': loggedUser.avatarUrl,
				'biography': loggedUser.biography,
			}
		};

		postsRepository.updatePost(postId, coverUrl, title, content);

		return response.status(201).json(postData);
	} else{
		return response.status(422).send('Oops! Please, check the data you are sending.');
	}

});

postsRouter.delete('/:id', (request, response) => {
	const posts = JSON.parse(JSON.stringify(getPosts()));
	const postId = JSON.parse(request.params.id);
	const post = posts.filter((p: Post) => p.id === postId);
	const loggedUser = getLoggedUserData();

	if(post[0].authorId !== loggedUser.id){
		return response.status(401).send('Oops! Check your credentials.');
	} else {
		postsRepository.deletePost(postId);
		return response.status(200).send('Ok!');
	}
});

export default postsRouter;