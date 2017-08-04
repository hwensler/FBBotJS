/**
 * Created by: HeatherWenslerNolis
 * @type {createApplication}
 */

//npm packages
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

//heroku environment variables
const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

//set ports - environment variable OR localhost 5000
app.set('port', (process.env.PORT || 5000))

//use json parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//function has a request and a response
app.get('/', function (req, res){
  res.send('Hi!')
})

//get and verify the webhook (make sure url ends in /webhook)
app.get('/webhook/', function(req, res){
    //verify if we have the right credentials to access facebook
    if(req.query['hub.verify_token'] ===
        token){
        res.send(req.query['hub.challenge'])
    }

    //if they aren't equal, return send 'no entry'
     res.send('No entry')
})

//add server
app.listen(app.get('port'), function(){
    //create log for heroku
    console.log('running on port', app.get('port'))
})

//post things to webhook
app.post('/webhook', function(req, res){
    //store body of the request into data
    var data = req.body

    //make sure the object is coming from a page
    if(data.object === 'page') {

        //iterate over each entry
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            //iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event)
                }
                else {
                    console.log("Webhook received unknown event: ", event)
                }
            })
        })

        //assume all went well
        //you must send back a 200 within 20 seconds, otherwise it'll time out
        res.sendStatus(200)
    }
})


function receivedMessage(event) {

    //store information about this message
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    //log the message
    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {

            //if the message just says 'cool'
            case 'cool':
                sendCoolMessage(senderID);
                break;
            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}


function sendTextMessage(recipientId, messageText) {
    var messageData = {

        //grab recipient
        recipient: {
            id: recipientId
        },

        //grab message
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}


function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: access },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent cool message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

function sendCoolMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "@HEATHERKLUS",
                        subtitle: "is the BEST TWITTER USER",
                        item_url: "https://twitter.com/heatherklus",
                        image_url: "https://pbs.twimg.com/profile_images/822228399561342976/zD42_jP-_400x400.jpg",
                        buttons: [{
                            type: "web_url",
                            url: "https://twitter.com/heatherklus",
                            title: "Open the best twitter"
                        }],
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}
