//npm packages
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

//set ports - environment variable OR localhost 5000
app.set('port', (process.env.PORT || 5000))

//use json parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//generic display
app.get('/', function (req, res){
    res.send('A PSID will display here someday.')
})