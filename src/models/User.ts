
class User {
    id: number;
	email?: string;
	username: string;
	avatarUrl: string;
	biography: string;
	password?: string;
	token?: string;

	constructor(
		id: number,
		email: string, 
		username: string, 
		avatarUrl: string, 
		biography: string, 
		password: string,
	){
		this.id = id;
		this.email = email;
		this.username = username;
		this.password = password;
		this.avatarUrl = avatarUrl;
		this.biography = biography;
	}
}

export default User;