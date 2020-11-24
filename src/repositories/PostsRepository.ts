import Post from '../models/Posts';
import dayjs from 'dayjs';
import joi from 'joi';
import stripHtml from 'string-strip-html';
import fs from 'fs';

const POSTSPATH = './data/posts.json';
class PostsRepository {
	private posts: Post[];
	private postId = 0;

	constructor(){
		this.posts = JSON.parse(fs.readFileSync(POSTSPATH, 'utf-8'));
		this.postId = this.posts[this.posts.length - 1].id;
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
		fs.writeFileSync(POSTSPATH, JSON.stringify(this.posts));

		return post;
	}

	public getPosts() : Post[]{
		return this.posts;
	}

	public updatePost(
		id: number,    	
		coverUrl: string,
    	title: string,
		content: string,
	) : void {
		const postIndex = this.posts.findIndex(e => e.id === id);
		const contentPreview = stripHtml(content.slice(0, 299)).result;
		this.posts[postIndex].coverUrl = coverUrl;
		this.posts[postIndex].title = title;
		this.posts[postIndex].content = content;
		this.posts[postIndex].contentPreview = contentPreview;
		fs.writeFileSync(POSTSPATH, JSON.stringify(this.posts));
	}

	public deletePost(id: number) : void{
		const postIndex = this.posts.findIndex(e => e.id === id);
		this.posts.splice(postIndex, 1);
		fs.writeFileSync(POSTSPATH, JSON.stringify(this.posts));
	}
}

export default PostsRepository;