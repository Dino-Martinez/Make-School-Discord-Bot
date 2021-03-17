//Require Libraries
const express = require('express')
import bodyParser from 'body-parser'

//Use Express
const app = express()

//Use Middleware
app.use(bodyParser.json())

app.get('/', (req, res) => {
  let dID = ''
  if( req.student.dID ) {
    dID = req.student.dID
  }
});

app.listen(3000, () => {
  console.log('Express Ready!')
})
