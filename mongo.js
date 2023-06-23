const mongoose = require('mongoose');

// Check password param exists
if (process.argv.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://freshc0w:${password}@cluster0.ox1vutg.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

// If no other arguments are set, display the phonebook
if (process.argv.length === 3) {
	Person.find({}).then(res => {
		res.forEach(p => {
			console.log(p);
		});
		mongoose.connection.close();
	});
}

// If 5 arguments are set, add name and number to db
if (process.argv.length === 5) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

    person.save().then(res => {
        console.log('person saved');
        mongoose.connection.close();
    })
}
