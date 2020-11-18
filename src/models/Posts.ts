
import dayjs from 'dayjs';
class Post {
    id: number;
	title: string;
	coverUrl: string;
	content: string;
	contentPreview?: string;
	publishedAt?: dayjs.Dayjs;
	authorId?: number;

	constructor(
		id: number,
		title: string, 
		coverUrl: string, 
		content: string, 
		contentPreview: string, 
		publishedAt: dayjs.Dayjs,
		authorId: number,
	){
		this.id = id;
		this.title = title;
		this.contentPreview = contentPreview;
		this.publishedAt = publishedAt;
		this.coverUrl = coverUrl;
		this.content = content;
		this.authorId = authorId;
	}
}

export default Post;