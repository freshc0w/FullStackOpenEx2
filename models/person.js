const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
	.connect(url)
	.then(res => {
		console.log('connected to MongoDB');
	})
	.catch(err => {
		console.log('error connecting to MongoDB:', err.message);
	});

const personSchema = new mongoose.Schema({
	// Mongoose validation
	name: {
		type: String,
		minLength: 3,
	},
	number: {
		type: String,
		minLength: 8,

		// custom validation
		validate: {
			validator: v => /^\d{2,3}-\d{0,9}$/.test(v),
		},
	},
});

// Need to set a valid id for the frontend and also remove mongodb
// versioning field __v

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
