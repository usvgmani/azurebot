let restify = require('restify');
let builder = require('botbuilder');
var GlobalRecognizer = require('./recognizers/globalRecognizer');
var CreateDialog =  require('./dialogs/createDialog')
let qAnda = require('./data.json');
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
let connector = new builder.ChatConnector({
    //MicrosoftAppId : process.env.MICROSOFT_APP_ID,
    //MicrosoftAppPassword : process.env.MICROSOFT_APP_PASSWORD
    appId:'c7d4fe8a-c154-426f-8780-6d57edf3325f',
    appPassword:'lvWVW205=|fcjorFWSH14_^'    
});
server.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//////////////////////////////////////////////////////////////////////////////////////
let bot = new builder.UniversalBot(connector, function (session, args) {
    session.send("Please rephrase your question!");  
});

bot.on('conversationUpdate', function(message) {
    // Send a hello message when bot is added
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
// Add global LUIS recognizer to bot
let luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4ee50075-25c9-495b-877e-ec48f4a0a837?subscription-key=4db27f29310b4779a2d1b60775dfcbd6&staging=true&verbose=true&timezoneOffset=0&q=';

bot.recognizer(new builder.LuisRecognizer(luisAppUrl));
// CRD number  dialog
bot.dialog('greeting', function (session, args, next) {
    session.endDialog("Hi! Welcome to Compliance FAQ Bot!!! <br/>How can we help you?");
})
.triggerAction({
    matches: "Greeting",
});
bot.dialog('helpDialog', function (session) {
    session.endDialog("This bot will echo back anything you say. Say 'goodbye' to quit.");
}).triggerAction({ matches: 'Help' });

// Add a global endConversation() action that is bound to the 'Goodbye' intent
bot.endConversationAction('goodbyeAction', "Thanks and hope your expectations were met.", { matches: 'Goodbye' });

bot.dialog('cancel', [function (session, args, next) {
    // session.endDialog("This is a bot relating to Compliance Portal. <br/>How can we help you?");
    builder.Prompts.choice(session, "This will end your conversation. Do you have any further question?", "yes|no", {listStyle: builder.ListStyle.button});     
},function (session, results) {           
    // session.send(`You chose: ${results.response.entity}.`); 
    if(results.response.entity=="yes"){
        var msg = "Welcome to Compliance FAQ Bot!!! Please ask your question.";
        session.endConversation(msg);
    }else{
        session.send(" Thanks and hope your expectations were met.");
    }
}])
.triggerAction({matches: 'CancelIntent'});

//create dialogs for luis intents
qAnda.complianceqa.forEach(function(element) {
   CreateDialog.createLuisDialog(bot, element.intent);
});


