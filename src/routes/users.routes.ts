import { getPosts } from './posts.routes';
import { Router } from 'express';

import User from '../models/User';
import Post from '../models/Posts';
import UsersRepository from '../repositories/UsersRepository';
import Session from 'src/models/Sessions';

const usersRouter = Router();
const usersRepository = new UsersRepository();

export const getUserData = (id : number | undefined ): User => {
	return usersRepository.getUserData(id);
};

export const validateToken = (token: string | undefined): Session | undefined => {
	return usersRepository.validateToken(token);
};

usersRouter.post('/sign-up', (request, response) => {
	const { email, username, avatarUrl, biography, password, passwordConfirmation} = request.body;

	const validation = usersRepository.validateUser(email, username, avatarUrl, biography, password, passwordConfirmation);
	const { error } = validation;

	const userIsInDatabase = usersRepository.isInDatabase(username, email);

	if(userIsInDatabase){
		return response.status(409).send('Username or Email already on the database');
	}

	if(error == null){
		const user = usersRepository.createUser(email, username, avatarUrl, biography, password);
		return response.status(201).json(user);
	}
	
	return response.status(422).send('Please, send only valid fields');
});

usersRouter.post('/sign-in', (request, response) => {
	const {email, password} = request.body;

	const login = usersRepository.login(email, password);

	if(login){
		return response.status(200).json(login);
	} else{
		return response.status(401).send('User not found or wrong password');
	}

});

usersRouter.get('/:id/posts', (request, response) => {
	const { offset, limit} = request.query;

	let posts = JSON.parse(JSON.stringify(getPosts()));
	const user = getUserData(JSON.parse(request.params.id));
	
	posts = posts.filter((p: Post) => p.authorId === user.id);
	
	posts = posts.map((p: Post) => {
		delete p.authorId;
		delete p.content;
		p.author = {
			'id': user.id,
			'username': user.username,
			'avatarUrl': user.avatarUrl,
			'biography': user.biography,
		};
		return p;
	});
	const filteredPosts = posts.slice(offset, limit); 
	return response.status(200).json({
		'count': posts.length,
		'posts': [...filteredPosts],
	});
});

usersRouter.put('/',(request, response) => {
	const { username, avatarUrl, biography} = request.body;
	
	const token = request.headers['authorization'];
	const sessionData =  usersRepository.validateToken(token);
	
	const validation = usersRepository.validateEditUser(username, avatarUrl, biography);
	const { error } = validation;

	if(error == null && sessionData){
		const id = sessionData.id;
		const user = usersRepository.editUserData(id, username, avatarUrl, biography);

		const userData = {
			'id': user.id,
			'email': user.email,
			'username': user.username,
			'avatarUrl': user.avatarUrl,
			'biography': user.biography,
		};

		return response.status(201).json(userData);
	}

	return response.status(422).send('Ops! check your fields and try again.');

});


export default usersRouter;