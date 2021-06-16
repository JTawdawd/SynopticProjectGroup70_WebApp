const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const ip = "86.184.101.251:7777"

app.use(cors({origin: 'http://' + ip}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const fs = require("fs");

app.listen(7777, function() {
	console.log('Server running on port 7777!');
})

app.get('/authKeys', function (request, response) {
	

	fs.readFile('./JSONs/AuthorizedStatus.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		response.send(file);
	});
	
});

app.get('/applications', function (request, response) {
	

	fs.readFile('./JSONs/Applications.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		response.send(file);
	});
	
});

app.get('/getJSON', function (request, response) {
	

	fs.readFile('./JSONs/TestJson.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		response.send(file);
	});
	
});


app.post('/submitApplication', function (request, response) {
	
	var test = request.body;
	console.log(test);
	
	fs.readFile('./JSONs/Applications.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		file.push(test);
		console.log(file);
		fs.writeFile('./JSONs/Applications.json', JSON.stringify(file), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved.");
		});
	
	});
	
});

app.post('/submitData', function (request, response) {
	
	var test = request.body;
	console.log(test);
	
	fs.readFile('./JSONs/TestJson.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		file.push(test);
		console.log(file);
		fs.writeFile('./JSONs/TestJson.json', JSON.stringify(file), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved.");
		});
	
	});
	
	
	
});

app.post('/updateAuthKeys', function (request, response) {
	var authKeyToBeAdded = request.body.authKey;
	
	fs.readFile('./JSONs/AuthorizedStatus.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		file.authKeys.push(authKeyToBeAdded);
		fs.writeFile('./JSONs/AuthorizedStatus.json', JSON.stringify(file), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved.");
		});
	
	});
});

app.post('/updateApplications', function (request, response) {
	var applicationToBeRemoved = request.body;
	
	fs.readFile('./JSONs/Applications.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		console.log(applicationToBeRemoved);
		var index = 0;
		for (var i = 0; i < file.length; i++) {
			if (JSON.stringify(file[i]) === JSON.stringify(applicationToBeRemoved)) {
				console.log("true");
				index = i;
				break;
			}
		}
		
		file.splice(index, 1);
		console.log(file);
		fs.writeFile('./JSONs/Applications.json', JSON.stringify(file), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved.");
		});
	
	});
});