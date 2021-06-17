/* import libraries */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const fs = require("fs");

/* origin ip of the server */
const ip = "localhost:3000"

/* set up express */
app.use(cors({origin: 'http://' + ip}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* listen on 7777 */
app.listen(7777, function() {
	console.log('Server running on port 7777!');
})

/* sends authorized status json when recieving http GET request at /authKeys */
app.get('/authKeys', function (request, response) {
	fs.readFile('./JSONs/AuthorizedStatus.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		response.send(file);
	});
	
});

/* sends applications json when recieving http GET request at /applications */
app.get('/applications', function (request, response) {
	fs.readFile('./JSONs/Applications.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		response.send(file);
	});
	
});

/* sends test jsons (content) json when recieving http GET request at /getJSON */
app.get('/getJSON', function (request, response) {
	fs.readFile('./JSONs/TestJson.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		response.send(file);
	});
	
});

/* recieves json, reads application json and writes appliction json + recieved json to applications json */
app.post('/submitApplication', function (request, response) {
	
	var application = request.body;
	
	fs.readFile('./JSONs/Applications.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		file.push(application);
		fs.writeFile('./JSONs/Applications.json', JSON.stringify(file), (err) => {
			if (err) throw err;
		});
	
	});
	
});

/* recieves json, reads test json and writes test json + recieved json to test json */
app.post('/submitData', function (request, response) {
	
	var content = request.body;
	
	fs.readFile('./JSONs/TestJson.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		file.push(content);
		fs.writeFile('./JSONs/TestJson.json', JSON.stringify(file), (err) => {
			if (err) throw err;
		});
	
	});
	
	
	
});

/* recieves json, reads auth keys json and writes auth keys json + recieved json to auth keys json */
app.post('/updateAuthKeys', function (request, response) {
	
	var authKeyToBeAdded = request.body.authKey;
	
	fs.readFile('./JSONs/AuthorizedStatus.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		file.authKeys.push(authKeyToBeAdded);
		fs.writeFile('./JSONs/AuthorizedStatus.json', JSON.stringify(file), (err) => {
			if (err) throw err;
		});
	
	});
});

/* recieves json, reads applications json, checks if recieved json is in application and removes it if it is. */
app.post('/updateApplications', function (request, response) {
	
	var applicationToBeRemoved = request.body;
	
	fs.readFile('./JSONs/Applications.json', (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		var index = 0;
		for (var i = 0; i < file.length; i++) {
			if (JSON.stringify(file[i]) === JSON.stringify(applicationToBeRemoved)) {
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
