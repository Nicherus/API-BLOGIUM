// import { v4 as uuid } from 'uuid';

class User {
    id: number;
	email: string;
	username: string;
	avatarUrl: string;
	biography: string;
	password?: string;

	constructor(
		id: number,
		email: string, 
		username: string, 
		avatarUrl: string, 
		biography: string, 
		password: string,
	){
		// this.id = uuid();
		this.id = id;
		this.email = email;
		this.username = username;
		this.password = password;
		this.avatarUrl = avatarUrl;
		this.biography = biography;
	}
}

export default User;