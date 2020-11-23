import User from '../models/User';
import Sessions from '../models/Sessions';
import { v4 as uuid } from 'uuid';
import joi from 'joi';
import fs from 'fs';

const PATH = './src/repositories';

class UsersRepository {
    private users: User[];
	private sessions: Sessions[];
	private userId = 0;
	public sessionUserId = 0;

	constructor(){
		this.users = JSON.parse(fs.readFileSync(PATH + '/users.json', 'utf-8'));
		this.sessions = JSON.parse(fs.readFileSync(PATH + '/sessions.json', 'utf-8'));
	}

	public validateUser(
    	email: string, 
    	username: string, 
    	avatarUrl: string, 
    	biography: string, 
    	password: string,
    	passwordConfirmation: string
	) : joi.ValidationResult {

    	const schema = joi.object({
    		email: joi.string().email().required(),
    		username: joi.string().alphanum().min(6).max(10).regex(/^[a-zA-Z0-9.]*$/).required(),
    		avatarUrl: joi.string().uri().required(),
    		biography: joi.string().min(50).max(300),
    		password: joi.string().min(6).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,10}$/).required(),
    		passwordConfirmation: joi.ref('password'),
    	});
        
    	const user = {
    		email,
    		username,
    		avatarUrl,
    		biography,
    		password,
    		passwordConfirmation,
    	};
        
    	return schema.validate(user);
	}

	public validateEditUser(username: string, avatarUrl: string, biography: string) : joi.ValidationResult {
		const schema = joi.object({
			username: joi.string().alphanum().min(6).max(10).regex(/^[a-zA-Z0-9.]*$/).required(),
    		avatarUrl: joi.string().uri().required(),
    		biography: joi.string().min(50).max(300),
		});

		const user = {username, avatarUrl, biography};

		return schema.validate(user);
	}
	
	public isInDatabase(username: string, email: string) : boolean {
    	const contains = this.users.some(e => e.username === username || e.email === email);
        
    	return contains; 
	}
	
	public createUser(
    	email: string, 
    	username: string, 
    	avatarUrl: string, 
    	biography: string, 
    	password: string,
	) : User {
            
    	this.userId++;
    	const user = new User(this.userId, email, username, avatarUrl, biography, password);

		this.users.push(user);
		fs.writeFileSync(PATH + '/users.json', JSON.stringify(this.users));
		
    	return user;
	}

	public login(email: string, password: string) : User | boolean {
		const user = this.users.find(e => e.email === email && e.password === password);

		if(user){
			const token = uuid();
			this.sessions.push({ 
				id: user.id, 
				token: token, 
			});
			fs.writeFileSync(PATH + '/sessions.json', JSON.stringify(this.sessions));
			return ({
				id: user.id,
				email: user.email,
				username: user.username,
				avatarUrl: user.avatarUrl,
				biography: user.biography,
				token: token,
			});
		} else{
			return false;
		}
	}

	public validateToken(token: string | undefined) : Sessions | undefined{
		const valid = this.sessions.find(e => e.token == token);
		return valid;
	}

	public getLoggedUserData() : User {
		return this.getUserData(this.sessionUserId);
	}

	public getUserData(id : number | undefined) : User {
		const userIndex = this.users.findIndex(e => e.id === id);
		return (this.users[userIndex]);
	}

	public editUserData(id: number, username: string, avatarUrl: string, biography: string) : User{
		const userIndex = this.users.findIndex(e => e.id === id);
		this.users[userIndex].username = username;
		this.users[userIndex].avatarUrl = avatarUrl;
		this.users[userIndex].biography = biography;

		fs.writeFileSync(PATH + '/users.json', JSON.stringify(this.users));
		return this.users[userIndex];
	}
}

export default UsersRepository;