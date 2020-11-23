import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3000, () => {
	console.log('Server is listening on port 3000.');
});