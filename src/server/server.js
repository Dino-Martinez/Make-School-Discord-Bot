const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup')
const util = require('util')
const Keyv = require('keyv')
const readline = require('readline')
const fs = require('fs');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
const client_secret = "uMfTeCXv0cqfB-GXUX9ZSmIU"
const client_id = "29759645700-2vvqd8cjeq6t18t8uihc3kleupgqg93t.apps.googleusercontent.com"
const redirect_uris = ["urn:ietf:wg:oauth:2.0:oob","http://localhost"]

// Configure dotenv for token grabbing
dotenv.config()

const students = new Keyv('sqlite://students.db')
let discordID = ""

//Middelware
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/start', async (req, res) => {
  discordID = await req.query.discordID
  res.redirect('/google-auth')
})

app.get('/google-auth', async (req, res) => {
  // Authorize a client with credentials, then call the Google Calendar API.
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  const student = await students.get(discordID)

  // Check if student has a token
  if (!student.token) {
    getAccessToken(oAuth2Client)
  }
  else {
    console.log(student.token)
    oAuth2Client.setCredentials(student.token);
    listEvents(oAuth2Client);
  }
})

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if student has a token
  student = students.get(discordID)
  if (!student.token) {
    getAccessToken(oAuth2Client, callback)
  }
  else {
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  }
}

async function getAccessToken(oAuth2Client) {
  const student = await students.get(discordID)
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to the student object for later querys
      student.token = token
      students.set(discordID, student)
    });
  });
}

function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 9,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        console.log(event.summary);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
