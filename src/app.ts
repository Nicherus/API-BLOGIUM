import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/posts', (request, response) => {
	return response.status(200).send('zap');
});

app.get('/api/posts', (request, response) => {
	return response.status(200).send('zap');
});

app.get('/api/users/:id/posts', (request, response) => {
	return response.status(200).send('zap');
});

app.get('/api/posts/:id', (request, response) => {
	return response.status(200).send('zap');
});

app.put('/api/posts/:id', (request, response) => {
	return response.status(200).send('zap');
});

app.delete('/api/posts/:id', (request, response) => {
	return response.status(200).send('zap');
});

app.listen(3000, () => {
	console.log('Server is listening on port 3000.');
});