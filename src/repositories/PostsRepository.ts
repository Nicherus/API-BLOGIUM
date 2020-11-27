import Post from '../models/Posts';
import dayjs from 'dayjs';
import db from '../database/index';
import stripHtml from 'string-strip-html';

export const createPost = async (
	coverUrl: string,
	title: string,
	content: string,
	sessionUserId: string,
) : Promise<Post | null> => {

	const contentPreview = stripHtml(content.slice(0, 299)).result;
	const publishedAt = dayjs();
	const authorId = sessionUserId;

	try{
		const postData = await db.query(`
			INSERT INTO posts (title, "coverUrl", "contentPreview", content, "publishedAt", "authorId")
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING *
		`, 
		[title, coverUrl, contentPreview, content, publishedAt, authorId]
		);
		return {
			id: postData.rows[0].id,
			title,
			coverUrl,
			content,
			publishedAt,
		};
	} catch(error){
		console.log(error);
		return null;
	}
};

export const getPosts = async (offset: any, limit: any) : Promise<Post[] | null> => {
	try{
		const posts = await db.query(`
			SELECT * FROM posts 
			LIMIT $1 OFFSET $2
		`, 
		[limit, offset]);
		return posts.rows;
	} catch(error){
		console.log(error);
		return null;
	}
};

export const getPostById = async (id: string) : Promise<Post | null> => {
	try{
		const post = await db.query(`
			SELECT * FROM posts 
			WHERE id = $1
		`, 
		[id]);
		return post.rows[0];
	} catch(error){
		console.log(error);
		return null;
	}
};

export const getPostsByUserId = async (id: string, offset: any, limit: any) : Promise<Post[] | null> => {
	try{
		const posts = await db.query(`
			SELECT * FROM posts 
			WHERE "authorId" = $1
			LIMIT $2 OFFSET $3
		`, 
		[id, limit, offset]);
		return posts.rows[0];
	} catch(error){
		console.log(error);
		return null;
	}
};

export const updatePost = async (
	id: number,    	
	coverUrl: string,
	title: string,
	content: string,
) : Promise<void | null> => {
	const contentPreview = stripHtml(content.slice(0, 299)).result;

	try{
		await db.query(`
			UPDATE posts 
			SET(title, "coverUrl", "contentPreview", content) = ($1, $2, $3, $4)
			WHERE id = $5
		`, 
		[title, coverUrl, contentPreview, content, id]
		);
	} catch(error){
		console.log(error);
		return null;
	}
};

export const deletePost = async (
	id: string) 
: Promise<void | null> => {
	try{
		await db.query(`
			DELETE FROM posts 
			WHERE id = $1
		`, [id]);
	} catch(error){
		console.log(error);
		return null;
	}
};