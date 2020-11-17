import express from 'express';

const app = express();

app.post('/api/users/sign-up', (request, response) => {
	response.status(200).send('zap');
});

app.post('/api/users/sign-in', (request, response) => {
	response.status(200).send('zap');
});

app.put('/api/users', (request, response) => {
	response.status(200).send('zap');
});
app.listen(3000);