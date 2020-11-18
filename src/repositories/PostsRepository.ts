import { object } from 'joi';
import Post from '../models/Posts';
// import joi from 'joi';

class UsersRepository {
	private posts: Post[];
	private postId = 0;

	constructor(){
    	this.posts = [];
	}
	
	public createPost(
    	coverUrl: string,
    	title: string,
    	content: string,
	) : Post {
		this.postId++;

		const post = new Post(this.postId, title, coverUrl, content);
	}

}

export default UsersRepository;