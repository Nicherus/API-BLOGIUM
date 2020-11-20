import { getPosts } from './posts.routes';
import { Router } from 'express';

import User from '../models/User';
import Post from '../models/Posts';
import UsersRepository from '../repositories/UsersRepository';

const usersRouter = Router();
const usersRepository = new UsersRepository();

export const getLoggedUserData = (): User => {
	return usersRepository.getLoggedUserData();
};

export const getUserData = (id : number | undefined ): User => {
	return usersRepository.getUserData(id);
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
		return response.status(200).send(login);
	} else{
		return response.status(401).send('User not found or wrong password');
	}

});

usersRouter.get('/:id/posts', (request, response) => {
	const { offset, limit} = request.query;
	let posts = JSON.parse(JSON.stringify(getPosts()));
	const user = getUserData(JSON.parse(request.params.id));
	posts = posts.filter((p: Post) => p.authorId === user.id);
	delete posts.content;
	delete posts.authorId;
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
	return response.status(200).send({
		'count': posts.length,
		'posts': [...filteredPosts],
	});
});

usersRouter.put('/', (request, response) => {
	return  response.status(200).send('PUT UPDATE USER');
});


export default usersRouter;