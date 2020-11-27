
class Session {
	userId: string;
	token: string;

	constructor(
		userId: string,
		token: string, 
	){
		this.token = token;
		this.userId = userId;
	}
}

export default Session;