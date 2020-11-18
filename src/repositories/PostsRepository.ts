import Post from '../models/Posts';
import dayjs from 'dayjs';
import joi from 'joi';
import stripHtml from 'string-strip-html';

class PostsRepository {
	private posts: Post[];
	private postId = 0;

	constructor(){
		this.posts = [];
	}

	public validatePost(coverUrl: string, title: string, content: string,) : joi.ValidationResult {
		
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
	}
	
	public createPost(
    	coverUrl: string,
    	title: string,
		content: string,
		sessionUserId: number,
	) : Post {

		this.postId++;
		const contentPreview = stripHtml(content.slice(0, 299)).result;
		const publishedAt = dayjs();
		const authorId = sessionUserId;
		
		const post = new Post(this.postId, title, coverUrl, content, contentPreview, publishedAt, authorId);

		this.posts.push(post);

		return post;
	}

}

export default PostsRepository;