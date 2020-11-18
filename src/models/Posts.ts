
class Post {
    id: number;
	title: string;
	coverUrl: string;
	contentPreview?: string;
	content: string;
	publishedAt?: string;
	authorId?: number;

	constructor(
		id: number,
		title: string, 
		contentPreview: string, 
		coverUrl: string, 
		content: string, 
		publishedAt: string,
	){
		this.id = id;
		this.title = title;
		this.contentPreview = contentPreview;
		this.publishedAt = publishedAt;
		this.coverUrl = coverUrl;
		this.content = content;
	}
}

export default Post;