
class Session {
    id: number;
	token: string;

	constructor(
		id: number,
		token: string, 
	){
		this.id = id;
		this.token = token;
	}
}

export default Session;