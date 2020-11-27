
import { Pool } from 'pg';



const db = new Pool({
	user: 'USER',
	host: 'HOST',
	port: 5432,
	database: 'DATABASE',
	password: 'PASSWORD'
});

export default db;