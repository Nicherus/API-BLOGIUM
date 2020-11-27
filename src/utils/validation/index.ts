
import joi from 'joi';

export const validateUser = (
    	email: string, 
    	username: string, 
    	avatarUrl: string, 
    	biography: string, 
    	password: string,
    	passwordConfirmation: string,
) : joi.ValidationResult => {

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
};

export const validateEditUser = (
	username: string, 
	avatarUrl: string, 
	biography: string,
) : joi.ValidationResult => {
	const schema = joi.object({
		username: joi.string().alphanum().min(6).max(10).regex(/^[a-zA-Z0-9.]*$/).required(),
		avatarUrl: joi.string().uri().required(),
		biography: joi.string().min(50).max(300),
	});

	const user = {username, avatarUrl, biography};

	return schema.validate(user);
};

export const validatePost = (
	coverUrl: string, 
	title: string, 
	content: string,
) : joi.ValidationResult => {
		
	const schema = joi.object({
		coverUrl: joi.string().uri().required(),
		title: joi.string().min(10).max(300),
		content: joi.string().min(100).max(600),
	});
		
	const post = {
		coverUrl,
		title,
		content,
	};

	return schema.validate(post);
};