import Session from '../models/Sessions';
import db from '../database/index';
import { v4 as uuid} from 'uuid';


export const createSession = async (
	id: string | undefined) 
    : Promise<Session | null> => {

	try{
		const token = uuid();
		const session = await db.query(`
            INSERT INTO sessions ("userId", token)
            VALUES ($1, $2)
            RETURNING *
        `,
		    [id, token]
		);
		return session.rows[0];
	} catch(error){
		console.log(error.message);
		return null;
	}
};

export const findSession = async (
	token: string) 
    : Promise<Session | undefined> => {

	try{
		const session = await db.query(`
            SELECT * FROM sessions
            WHERE token = $1
        `,
		    [token]
		);
		return session.rows[0];
	} catch(error){
		console.log(error.message);
	}
};

export const findSessionByToken = async (
	token: string) 
    : Promise<Session | null> => {
    
	try{
		const tokenSearch = await db.query(`
            SELECT * FROM sessions
            WHERE token = $1
        `,
		[token]
		);
		return tokenSearch.rows[0];
	} catch(error){
		console.log(error);
		return null;
	}

};