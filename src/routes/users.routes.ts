import { Router } from 'express';

import User from '../models/User';
import UsersRepository from '../repositories/UsersRepository';

const usersRouter = Router();
const usersRepository = new UsersRepository();

export const getUserData = (): User => {
	return usersRepository.getUserData();
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
	return response.status(200).send(`GET POSTS BY USER ID${request.params.id}`);
});

usersRouter.put('/', (request, response) => {
	return  response.status(200).send('PUT UPDATE USER');
});


export default usersRouter;