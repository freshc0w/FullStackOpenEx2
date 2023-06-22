const express = require('express');
const app = express();

// CORS policy
const cors = require('cors');

// morgan middleware
const morgan = require('morgan');

// for receiving data: POST
app.use(express.json());

// CORS policy
app.use(cors());

// middleware
const requestLogger = (request, response, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('---');
	next();
};
app.use(requestLogger);

// morgan middleware custom fnc for POST
const reqMorganLogger = (tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'),
		'-',
		tokens['response-time'](req, res),
		'ms',
        JSON.stringify(req.body)
	].join(' ');
};
app.use(morgan(reqMorganLogger));

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

// Deleting a resource
app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	data = data.filter(d => d.id !== id);
	res.status(204).end();
});

/**
 * Generates a random id based on a max value combinations.
 * Max value probably would be 100,000 to lower the chance
 * of two people having the same id
 */
const generateId = max => {
	return Math.floor(Math.random() * max);
};

// POSTING content
app.post('/api/persons', (req, res) => {
	const body = req.body;
    console.log(req.body);

	const handleError = errorMsg => {
		return res.status(400).json({
			error: errorMsg,
		});
	};

	// If no name or number found, or if the name already exist
	// in the phone book, generate error 400.
	if (!body.name) return handleError('Name missing');
	if (!body.number) return handleError('Number missing');
	if (data.some(d => d.name === body.name))
		return handleError('Name already exists in the phonebook');

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(100000),
	};

	// Add person to collection of data
	data = data.concat(person);

	res.json(person);
});

// Configure to PORT 3001
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
