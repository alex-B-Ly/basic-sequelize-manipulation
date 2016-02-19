var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');

var Sequelize = require('sequelize');

var connection = new Sequelize('userbase_db', 'root');

var PORT = 8080;

var app = express();

app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
	extended: false
}));

var Users = connection.define('users', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: {
				args: [1,255],
				msg: 'Please enter your name',
			}
		}
	},
	phone_number: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	message: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: {
				args: [1,255],
				msg: 'Please enter a valid message',
			}
		}
	}
});

app.get('/', function(req,res) {
	Users.findAll({}).then(function(results) {
		res.render('home', {results});
	});
});

app.post('/entry', function(req, res) {
	var userName = req.body.name;
	var userPhone = req.body.phone;
	var userMessage = req.body.message;

	Users.create({
		name: userName,
		phone_number: userPhone,
		message: userMessage
	}).then(function(result) {
		res.redirect('/success');
	}).catch(function(err) {
		console.log(err);
		res.redirect('/fail');
	});
});

app.get('/success', function(req, res) {
	res.send('Success Page!');
});

app.get('/fail', function(req, res) {
	res.send('Fail to add entry!');
});

connection.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Listening on port %s", PORT);
	});
});






