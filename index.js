const express = require('express');
const app = express();

// for receiving data: POST
app.use(express.json());

let data = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>');
});

// GET request for /api/persons
app.get('/api/persons', (req, res) => {
	res.json(data);
});

// Fetching a single resource
app.get('/api/persons/:id', (req, res) => {
	// convert param id to number format first
	const id = Number(req.params.id);

	const person = data.find(p => p.id === id);

	person ? res.json(person) : res.status(404).end();
});

// render page at localhost:3001/info
app.get('/info', (req, res) => {
	res.send(
		`<p>Phonebook has info for ${
			data.length
		} people</p><p>${new Date()}</p>`
	);
});

// Configure to PORT 3001
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
