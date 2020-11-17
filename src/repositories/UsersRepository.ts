import User from '../models/User';
import joi from 'joi';

class UsersRepository {
    private users: User[];
    private userId = 0;

    constructor(){
    	this.users = [];
    }

    public createUser(
    	email: string, 
    	username: string, 
    	avatarUrl: string, 
    	biography: string, 
    	password: string,
    ) : User | number {
            
    	this.userId++;
    	const user = new User(this.userId, email, username, avatarUrl, biography, password);

    	this.users.push(user);
        
    	return user;
    }

    public isInDatabase(username: string, email: string) : boolean {
    	// const contains = this.users.some(e => e.username === username || e.email === email);
        
    	return false; //mudar
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
    		username: joi.string().alphanum().min(6).max(10).required(),
    		avatarUrl: joi.string().uri().required(),
    		biography: joi.string().min(50).max(300),
    		password: joi.string().min(6).regex(/^[a-zA-Z0-9]{1,30}$/).required(),
    		passwordConfirmation: joi.ref('password'),
    	}).unknown();
        
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
}

export default UsersRepository;