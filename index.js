/**
 * Created by: HeatherWenslerNolis
 * @type {createApplication}
 */

//npm packages

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

app.set('port', (process.env.PORT || 5000))

