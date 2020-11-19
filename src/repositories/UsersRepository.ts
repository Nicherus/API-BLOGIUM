import User from '../models/User';
import { v4 as uuid } from 'uuid';
import joi from 'joi';

class UsersRepository {
    private users: User[];
	private userId = 0;
	public sessionToken = '0';
	public sessionUserId = 0;

	constructor(){
		this.users = [];
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
        
    	return user;
	}

	public login(email: string, password: string) : User | boolean {
		const contains = this.users.some(e => e.email === email && e.password === password);

		if(contains){
			this.sessionToken = uuid();
			const userIndex = this.users.findIndex(e => e.email === email);
			this.sessionUserId = this.users[userIndex].id;
			return ({
				id: this.users[userIndex].id,
				email: this.users[userIndex].email,
				username: this.users[userIndex].username,
				avatarUrl: this.users[userIndex].avatarUrl,
				biography: this.users[userIndex].biography,
				token: this.sessionToken,
			});
		} else{
			return contains;
		}

	}

	public getLoggedUserData() : User {
		return this.getUserData(this.sessionUserId);
	}

	public getUserData(id : number) : User {
		const userIndex = this.users.findIndex(e => e.id === id);
		return (this.users[userIndex]);
	}
}

export default UsersRepository;