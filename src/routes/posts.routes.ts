// import { getUserData, validateToken } from './users.routes';
import { Router } from 'express';
import { findSessionByToken } from '../repositories/SessionsRepository';
import { getUserDataById } from '../repositories/UsersRepository';
import { createPost, getPostById, getPosts, updatePost, deletePost } from '../repositories/PostsRepository';
import { validatePost } from '../utils/validation';
import Post from 'src/models/Posts';

const postsRouter = Router();


postsRouter.post('/', async (request, response) => {
	const {coverUrl, title, content} = request.body;
	const token = request.headers['authorization'];
    
	const validation = validatePost(coverUrl, title, content);
	const { error } = validation;
    
	if(!token){
		return response.status(403).send('Ops! check your authorizations.');
	}
    
	const sessionData = await findSessionByToken(token);

	if(error){
		console.log(error);
		return response.status(422).send('OOps! check your fields and try again.');
	}

	if(sessionData){
		const post = await createPost(coverUrl, title, content, sessionData.userId);
		const user = await getUserDataById(sessionData.userId);
        
		if(!post){
			return response.status(404).send('Post not found.');
		}
        
		if(user && post){
			const postData = {
				'id': post.id,
				'title': post.title,
				'coverUrl': post.coverUrl,
				'content': post.content,
				'publishedAt': post.publishedAt,
				'author': {
					'id': user.id,
					'username': user.username,
					'avatarUrl': user.avatarUrl,
					'biography': user.biography,
				}
			};
            
			return response.status(201).json(postData);
		}
	} else{
		return response.status(422).send('Oops! Please, check the data you are sending.');
	}
});

postsRouter.get('/', async (request, response) => {
	const { offset, limit} = request.query;
    
	const posts = await getPosts(offset, limit);
    
	if(!posts){
		return response.status(404).send('Posts not found.');
	}
    
	if(posts){
		const constructedPosts = Promise.all(posts.map(async (p: Post) => {
			const author = await getUserDataById(p.authorId);
			delete author?.email;
			if(author){
				delete p.authorId;
				delete p.content;
				p.author = author;
				return p;
			}
		}));
		return response.status(200).json({
			'count': posts.length,
			'posts': [...await constructedPosts],
		});
	}
});

postsRouter.get('/:id', async (request, response) => {
	const post = await getPostById(request.params.id);
	if(!post){
		return response.status(404).send('Post not found.');
	}
	if(post){
		const author = await getUserDataById(post.authorId);
		if(author){
			delete post.authorId;
			delete post.contentPreview;
			return response.status(200).json({
				...post,
				'author': {
					'id': author.id,
					'username': author.username,
					'avatarUrl': author.avatarUrl,
					'biography': author.biography,
				}
			});
		}
	}
});

postsRouter.put('/:id', async (request, response) => {
	const {coverUrl, title, content} = request.body;
	const postId = JSON.parse(request.params.id);
	const token = request.headers['authorization'];
    
	const validation = validatePost(coverUrl, title, content);
	const { error } = validation;
    
	if(!token){
		return response.status(403).send('Ops! check your authorizations.');
	}
    
	const sessionData = await findSessionByToken(token);

	if(error){
		console.log(error);
		return response.status(422).send('OOps! check your fields and try again.');
	}
	
	if(sessionData){
		const user = await getUserDataById(sessionData.userId);
		const post = await getPostById(postId);
        
		if(!post){
			return response.status(404).send('Post not found.');
		}

		if(user && post){
			if(post.authorId !== user.id){
				return response.status(401).send('Oops! Check your credentials.');
			}
        
			const postData = {
				'id': post.id,
				'title': title,
				'coverUrl': coverUrl,
				'content': content,
				'publishedAt': post.publishedAt,
				'author': {
					'id': post.authorId,
					'username': user.username,
					'avatarUrl': user.avatarUrl,
					'biography': user.biography,
				}
			};
        
			await updatePost(postId, coverUrl, title, content);
        
			return response.status(201).json(postData);
		}
	} else{
		return response.status(422).send('Oops! Please, check the data you are sending.');
	}
});

postsRouter.delete('/:id', async (request, response) => {
	const token = request.headers['authorization'];

	if(!token){
		return response.status(401).send('Oops! Check your credentials.');
	}

	const sessionData = await findSessionByToken(token);

	if(sessionData){
		const user = await getUserDataById(sessionData.userId);
		const post = await getPostById(request.params.id);
		if(!post){
			return response.status(404).send('Post not found.');
		}
		if(user && post){
			if(post.authorId !== user.id){
				return response.status(401).send('Oops! Check your credentials.');
			} else {
				deletePost(request.params.id);
				return response.status(200).send('Ok!');
			}
		}
	} else{
		response.status(401).send('Please, check the data you are sending');
	}

});

export default postsRouter;