/**
 * Created by: HeatherWenslerNolis
 * @type {createApplication}
 */

//npm packages

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

//set ports - enviroment variable OR localhost 5000
app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//function has a request and a response
app.get('/', function (req, res){
  res.send('Hi!')
})

//get and verify the webhook
app.get('/webhook/', function(req, res){
    //verify if we have the right credentials to access facebook
    if(req.query['hub.verify_token'] ===
        'my_voice_is_my_password_verify_me'){
        res.send(req.query['hub.challenge'])
    }

    //if they aren't equal, return send 'no entry'
     res.send('No entry')
})