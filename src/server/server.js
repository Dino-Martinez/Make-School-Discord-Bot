const express = require('express')
const exphbs = require("express-handlebars");
const dotenv = require('dotenv')
const bodyParser = require("body-parser");
const readline = require('readline')
const Keyv = require('keyv')
const { google } = require('googleapis')
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
dotenv.config()

//Configure OAuth2 Client for Google Calendar API
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES
})

//Initialize App
const app = express()

//Use body parser to send data in between routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Configure handlebars templating engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure Keyv instance to store student data
const students = new Keyv('sqlite://../../students.db')
let discordID = ''

app.get('/google-auth', async (req, res) => {
  discordID = await req.query.discordID
  const student = await students.get(discordID)

  // Check if student has a token
  if (!student.token) {
    res.render("home", { authUrl })
  } else {
    oAuth2Client.setCredentials(student.token)
    storeEvents(oAuth2Client, student)
  }
})

app.post('/google/login', async (req, res) => {
  const student = await students.get(discordID)
  const code = req.body.code
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err)
    oAuth2Client.setCredentials(token)
    // Store the token to the student object for later querys
    student.token = token
    students.set(discordID, student)
    storeEvents(oAuth2Client, student)
  })
})

function storeEvents (auth, student) {
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
      console.log(courses)
      student.courses = courses
      students.set(discordID, student)
    }
  })
}
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
