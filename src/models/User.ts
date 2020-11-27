
class User {
	id?: string;
	email?: string;
	username: string;
	avatarUrl: string;
	biography: string;
	password?: string;
	token?: string;

	constructor(
		email: string, 
		username: string, 
		avatarUrl: string, 
		biography: string, 
		password: string,
	){
		this.email = email;
		this.username = username;
		this.avatarUrl = avatarUrl;
		this.biography = biography;
		this.password = password;
	}
}

export default User;