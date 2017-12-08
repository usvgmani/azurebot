let restify = require('restify');
let builder = require('botbuilder');
let botenv = require('dotenv')
let apiai = require('apiai');
var uuid = require('uuid4');

var GlobalRecognizer = require('./recognizers/globalRecognizer');
var CreateDialog =  require('./dialogs/createDialog')
let qAnda = require('./data.json');


//=========================================================
// Bot Setup
//=========================================================
const result = botenv.config()
if (result.error) {
  throw result.error
}

// Setup Restify Server
let server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
// Create chat bot
let connector = new builder.ChatConnector({
   // appId:process.env.MICROSOFT_APP_ID,
    //appPassword:process.env.MICROSOFT_APP_PASSWORD       
       appId:null,
       appPassword:null   
});
server.post('/api/messages', connector.listen());

let luisAppUrl = process.env.LUIS_APP_URL ||'http://westus.api.cognitive.microsoft.com/luis/v2.0/apps/92a3b546-ef92-48bf-b216-71d65cac3d80?subscription-key=889559f5d6f34797b013266f77fe2400&staging=true&verbose=true&timezoneOffset=-360&q=';
let apiaiid = process.env.APIAI_APP_URL || 'a9c2fa56d15b49a69304e38ababe493a';
var appAPIAI = apiai(apiaiid);

//=========================================================
// Bots Dialogs
//////////////////////////////////////////////////////////////////////////////////////
let bot = new builder.UniversalBot(connector, function (session, args) {
    console.log(session.message.text);
    //session.send("Please rephrase your question!");  
    CreateDialog.startsmalltalkDialog(session,session.message.text, uuid,appAPIAI)

});

bot.on('conversationUpdate', function(message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function(identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message().address(message.address).text("Hi! Welcome to Compliance FAQ Bot!!!");
                bot.send(reply);
            }
        });
    }
});

GlobalRecognizer.addGlobalRecognizer(bot);
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));


bot.dialog('helpDialog', function (session) {
    session.endDialog("This bot will echo back anything you say. Say 'goodbye' to quit.");
}).triggerAction({ matches: 'Help' });

// Add a global endConversation() action that is bound to the 'Goodbye' intent
bot.endConversationAction('goodbyeAction', "Thanks and hope your expectations were met.", { matches: 'Goodbye' });

bot.dialog('cancel', [function (session, args, next) {
    builder.Prompts.choice(session, "This will end your conversation. Do you have any further question?", "yes|no", {listStyle: builder.ListStyle.button});     
},function (session, results) {           
    if(results.response.entity=="yes"){
        var msg = "Welcome to Compliance FAQ Bot!!! Please ask your question.";
        session.endConversation(msg);
    }else{
        session.endConversation(" Thanks and hope your expectations were met.");
    }
}]).triggerAction({matches: 'CancelIntent'});

bot.dialog('smalltalk', [function (session, args) {           
    session.send(args.intent.smalltalkresponse);
}]).triggerAction({matches: 'SmalltalkIntent'});

//create dialogs for luis intents
qAnda.complianceqa.forEach(function(element) {
   CreateDialog.createLuisDialog(bot, element.intent);
});