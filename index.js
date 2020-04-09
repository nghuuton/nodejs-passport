const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Sequelize = require('sequelize');

const fs = require('fs');
const app = express();
const db = require('./db');


app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: "my secret",
	cookie: {
		maxAge: 1000 * 60 * 100
	}
}))
app.use(Passport.initialize());
app.use(Passport.session());


app.get('/', (req, res) => {
	res.render('index');
});

app.route('/login')
	.get((req, res) => {
		if (req.isAuthenticated()) {
			res.redirect('/private')
		} else {
			res.render('login')
		}
	})
	.post(Passport.authenticate('local', {
		failureRedirect: '/login',
		successRedirect: '/loginOK'
	}))
app.get('/private', (req, res) => {
	if (req.isAuthenticated()) {
		if ('ADMIN' == req.user.role) {
			res.send("Welcome private page!");
		} else {
			res.send("You cant' go in this page!")
		}
	} else {
		res.send("You must login");
	}
});

app.get('/loginOK', (req, res) => {
	res.send("Welcome " + req.user.usr)
})

Passport.use(new LocalStrategy(
	(username, password, done) => {
		fs.readFile('./userDB.json', (err, data) => {
			const db = JSON.parse(data);
			const userRecord = db.find(user => {
				return user.usr == username
			})
			if (userRecord && userRecord.pwd == password) {
				return done(null, userRecord)
			} else {
				return done(null, false)
			}
		})
	}
));

Passport.serializeUser((user, done) => {
	done(null, user.usr)
})

Passport.deserializeUser((name, done) => {
	fs.readFile('./userDB.json', (err, data) => {
		const db = JSON.parse(data);
		const userRecord = db.find(user => {
			return user.usr == name
		});
		if (userRecord) {
			return done(null, userRecord);
		} else {
			return done(null, false)
		}
	})
})

const port = 3000;

app.listen(port, function () {
	console.log('Server is start!')
})