import { Router } from 'express';

import { findSessionByToken } from 'src/repositories/SessionsRepository';
import { 
	createUser, 
	login, 
	editUserData,
	isInDatabase,
	getUserDataById} 
	from '../repositories/UsersRepository';
import { getPostsByUserId } from '../repositories/PostsRepository';
import { validateUser, validateEditUser } from '../utils/validation';
import Post from 'src/models/Posts';

const usersRouter = Router();

usersRouter.post('/sign-up', async (request, response) => {
	const { email, username, avatarUrl, biography, password, passwordConfirmation} = request.body;

	const validation = validateUser(email, username, avatarUrl, biography, password, passwordConfirmation);
	const { error } = validation;

	const userIsInDatabase = await isInDatabase(username, email);

	if(userIsInDatabase){
		return response.status(409).send('Username or Email already on the database');
	}
	
	if(!userIsInDatabase && error == null){
		const user = await createUser(email, username, avatarUrl, biography, password);
		if(user){
			return response.status(201).json(user);
		} else{
			return response.status(422).send('database error');
		}
	}
	
});

usersRouter.post('/sign-in', async (request, response) => {
	const {email, password} = request.body;

	const loginData = await login(email, password);

	if(loginData){
		return response.status(200).json(loginData);
	} else{
		return response.status(401).send('User not found or wrong password');
	}

});

usersRouter.put('/', async (request, response) => {
	const { username, avatarUrl, biography} = request.body;
	const token = request.headers['authorization'];

	const validation = validateEditUser(username, avatarUrl, biography);
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
		const id = sessionData.userId;
		const user = await editUserData(id, username, avatarUrl, biography);
		if(user){
			const userData = {
				'id': id,
				'email': user.email,
				'username': user.username,
				'avatarUrl': user.avatarUrl,
				'biography': user.biography,
			};
			return response.status(201).json(userData);
		} else{
			return response.status(422).send('Ops! check yAAour fields and try again.');
		}
	}
});

usersRouter.get('/:id/posts', async (request, response) => {
	const { offset, limit} = request.query;
	const userId = request.params.id;
	
	const author = await getUserDataById(userId);

	if(!author){
		return response.status(404).send('user not found');
	}

	const posts = await getPostsByUserId(userId, offset, limit);
	console.log(posts);
	if(!posts){
		return response.status(404).send('no post was found');
	} else if(posts.length > 1){
		const postsData = posts.map((p: Post) => {
			delete p.authorId;
			delete p.content;
			p.author = {
				'id': userId,
				'username': author.username,
				'avatarUrl': author.avatarUrl,
				'biography': author.biography,
			};
			return p;
		});
		return response.status(200).json({
			'count': posts.length,
			'posts': [...postsData],
		});
	}
});


export default usersRouter;