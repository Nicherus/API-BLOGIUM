import { Router } from 'express';

import UsersRepository from '../repositories/UsersRepository';

const usersRouter = Router();
const usersRepository = new UsersRepository();

usersRouter.post('/sign-up', (request, response) => {
	const { email, username, avatarUrl, biography, password, passwordConfirmation} = request.body;

	const validation = usersRepository.validateUser(email, username, avatarUrl, biography, password, passwordConfirmation);
	const { error } = validation;

	const userIsInDatabase = usersRepository.isInDatabase(username, email);

	if(userIsInDatabase){
		return response.status(409);
	}
	
	if(error == null){
		const user = usersRepository.createUser(email, username, avatarUrl, biography, password);
		response.status(201).json(user);
	}
	
	response.status(422);
});

usersRouter.post('/sign-in', (request, response) => {
	response.status(200).send('POST SIGN IN');
});

usersRouter.get('/:id/posts', (request, response) => {
	return response.status(200).send(`GET POSTS BY USER ID${request.params.id}`);
});

usersRouter.put('/', (request, response) => {
	response.status(200).send('PUT UPDATE USER');
});


export default usersRouter;