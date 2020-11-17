import express from 'express';

const app = express();

app.post('/api/posts', (request, response) => {
	response.status(200).send('zap');
});

app.get('/api/posts', (request, response) => {
	response.status(200).send('zap');
});

app.get('/api/users/:id/posts', (request, response) => {
	response.status(200).send('zap');
});

app.get('/api/posts/:id', (request, response) => {
	response.status(200).send('zap');
});

app.put('/api/posts/:id', (request, response) => {
	response.status(200).send('zap');
});

app.delete('/api/posts/:id', (request, response) => {
	response.status(200).send('zap');
});

app.listen(3000);