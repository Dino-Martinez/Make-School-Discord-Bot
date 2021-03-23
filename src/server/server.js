const express = require('express')
const dotenv = require('dotenv')
const app = express()
const readline = require('readline')
const Keyv = require('keyv')
const { google } = require('googleapis')
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

// Configure dotenv for token grabbing
dotenv.config()

// Configure Keyv instance to store student data
const students = new Keyv('sqlite://../../students.db')
let discordID = ''

app.get('/start', async (req, res) => {
  discordID = await req.query.discordID
  res.redirect('/google-auth')
})

app.get('/google-auth', async (req, res) => {
  // Authorize a client with credentials, then call the Google Calendar API.
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  const student = await students.get(discordID)

  // Check if student has a token
  if (!student.token) {
    getAccessToken(oAuth2Client, student)
    // res.redirect(authUrl)
  } else {
    oAuth2Client.setCredentials(student.token)
    listEvents(oAuth2Client, student)
  }
})

async function getAccessToken (oAuth2Client, student) {
  // generate the Auth Url for a User to get an access token to Google Calendar API
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to the student object for later querys
      student.token = token
      students.set(discordID, student)
      listEvents(oAuth2Client, student)
    })
  })
}

function listEvents (auth, student) {
  const calendar = google.calendar({ version: 'v3', auth })
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 2000,
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)
    const events = res.data.items
    const courses = []
    if (events.length) {
      events.map((event, i) => {
        // This filters the makeschool student's events on classes
        if ((event.organizer.displayName === 'College Courses') && (event.creator.displayName === 'Dion Larson')) {
          if (!courses.includes(event.summary)) {
            courses.push(event.summary)
          }
        }
      })
      student.courses = courses
      students.set(discordID, student)
    }
  })
}
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
