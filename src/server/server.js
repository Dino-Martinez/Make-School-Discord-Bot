const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const readline = require('readline')
const Keyv = require('keyv')
const fs = require('fs');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

// Configure dotenv for token grabbing
dotenv.config()

// Configure Keyv instance to store student data
const students = new Keyv('sqlite://../../students.db')
let discordID = ""

app.get('/start', async (req, res) => {
  discordID = await req.query.discordID
  res.redirect('/google-auth')
})

app.get('/google-auth', async (req, res) => {
  // Authorize a client with credentials, then call the Google Calendar API.
  const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
  const student = await students.get(discordID)

  // Check if student has a token
  if (!student.token) {
    getAccessToken(oAuth2Client, student)
  }
  else {
    oAuth2Client.setCredentials(student.token);
    listEvents(oAuth2Client);
  }
})

async function getAccessToken(oAuth2Client, student) {
  //generate the Auth Url for a User to get an access token to Google Calendar API
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
      listEvents(oAuth2Client)
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
