import User from '../models/User';
import db from '../database/index';
import bcrypt from 'bcrypt';
import { createSession } from './SessionsRepository';

export const createUser =  async (
    	email: string, 
    	username: string, 
    	avatarUrl: string, 
    	biography: string, 
    	password: string,
) : Promise<User | null> => {

	const encryptedPassword = bcrypt.hashSync(password, 10);
	try {
		const user = new User(email, username, avatarUrl, biography, password);
		await db.query(`
			INSERT INTO users (username, biography, "avatarUrl", email, password)
			VALUES ($1, $2, $3, $4, $5)`,
		[username, biography, avatarUrl, email, encryptedPassword]
		);
		delete user.password;
		return user;
	} catch (error) {
		console.log(error.message);
		return null;
	}
};

export const login = async (
	emailInserted: string, 
	passwordInserted: string,
) : Promise<boolean | User> => {

	const loginData = await checkEmailPasswordMatch(emailInserted, passwordInserted);
	if(loginData){
		const {username, biography, avatarUrl, email, id} = loginData;
		const sessionData = await createSession(id);
		if(sessionData){
			return ({
				email: email,
				username: username,
				avatarUrl: avatarUrl,
				biography: biography,
				token: sessionData.token,
			});
		} else{
			return false;
		}
	} else{
		return false;
	}
};

export const editUserData = async (
	id: string, 
	username: string, 
	avatarUrl: string, 
	biography: string,
) : Promise<User | null | undefined> => {
			
	try{
		await db.query(`
			UPDATE users
			SET(username, biography, "avatarUrl") = ($1, $2, $3)
			WHERE id = $4
			`,
		[username, biography, avatarUrl, id]
		);
		const userData = await getUserDataById(id);
		if(userData){
			return({
				id,
				email: userData.email,
				username,
				avatarUrl,
				biography,
			});
		}
	} catch(error){
		console.log(error);
	}
};
	
export const checkEmailPasswordMatch = async (
	email: string, 
	password: string,
) : Promise<User | null | undefined> => {

	try {
		const UserEmailMatch = await db.query(`
		SELECT * FROM users
		WHERE email = $1
		`,
		[email]
		);
		const passwordMatch = bcrypt.compareSync(password, UserEmailMatch.rows[0].password);
		if(passwordMatch){
			return UserEmailMatch.rows[0];
		}
	} catch (error) {
		console.log(error.message);
		return(null);
	}
};

export const isInDatabase = async (
	username: string, 
	email: string,
) : Promise<boolean | null> => {

	try{
		const userMatch = await db.query(`
			SELECT * FROM users
			WHERE email = $1 OR username = $2
			`,
		[email, username]
		);
		return userMatch.rows.length ? true : false;
	} catch(error){
		console.log(error.message);
		return null;
	}
};

export const getUserDataById = async (
	id: string | undefined,
) : Promise<User | null> => {

	try{
		const UserMatch = await db.query(`
			SELECT * FROM users
			WHERE id = $1
			`,
		[id]
		);
		const {username, avatarUrl, biography, email} = UserMatch.rows[0];
		const userId = UserMatch.rows[0].id;
		return {
			id: userId,
			username,
			avatarUrl,
			biography,
			email,
		};
	} catch(error){
		console.log(error.message);
		return null;
	}
};