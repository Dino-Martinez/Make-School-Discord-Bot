//Require Libraries
const express = require('express');
const bodyParser = require ('body-parser')
const {google} = require('googleapis');
const readline = require('readline');


const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const credentials = require('./credentials.json');
const {client_secret, client_id, redirect_uris} = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

//Use Express
const app = express()

//Use Middleware
app.use(bodyParser.json())

app.get('/', (req, res) => {
  let dID = ''
  if( req.student.dID ) {
    dID = req.student.dID
  }

  const student = students.get(author.id)

  if(!student) {
      return
    }
  else {
    if (!student.token) {
        //Get token from OAuth2 and save token to a student
        const token = getAccessToken(oAuth2Client, callback, student);
        oAuth2Client.setCredentials(JSON.parse(token));
    } else {
      // listEvents
    }
  }
});

app.listen(3000, () => {
  console.log('Express Ready!')
})
