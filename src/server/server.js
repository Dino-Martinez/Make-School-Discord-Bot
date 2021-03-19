const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');
const util = require('util')
const Keyv = require('keyv')

// Configure dotenv for token grabbing
dotenv.config()

const students = new Keyv('sqlite://students.db')
let discordID = ""

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieSession({
    name: process.env.SESSION_NAME,
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

app.get('/failed', (req, res) => res.send('Please Login with your Makeschool Email!'))

// Route that handles storing information on the student
app.get('/good', isLoggedIn, async(req, res) => {
  const student = await students.get(discordID)


  if(!(req.user._json.email).includes("makeschool")) {
    res.redirect('/failed');
  }
  else {

    student.name = req.user.displayName
    student.email = req.user._json.email

    //update or create a new student in our students db
    await students.set(discordID, student)

    res.send(`Welcome! Thank you for authenticating! You may now return to the Discord Server!`)
  }
})
//
// Auth Routes
app.get('/start', (req, res) => {
  //Get the Discord ID to store in our DB
  discordID = req.query.did
  res.redirect('/google')
});

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
});

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

//mostly for development purposes, remove before production
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
