var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    //MicrosoftAppId : process.env.MICROSOFT_APP_ID,
    //MicrosoftAppPassword : process.env.MICROSOFT_APP_PASSWORD
    appId:'b3cedff9-fbdf-4a88-a4fc-d78543ef6e59',
    appPassword: 'UaraEhZSSMosKq9789VqbRD'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b2aeee67-84d0-4c4a-8722-343cafa0ffe6?subscription-key=4db27f29310b4779a2d1b60775dfcbd6&verbose=true&timezoneOffset=0.0&spellCheck=false&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', dialog);

// Add intent handlers
dialog.matches('WhatHappensIf',  [
    function (session, args, next) {
       // var task = builder.EntityRecognizer.findEntity(args.entities, 'meetingtitle');
        var forgesignature = builder.EntityRecognizer.findEntity(args.entities, 'Whatif_forgesignature');
        if (!forgesignature) {
            builder.Prompts.text(session, "hmm thats a good question!");
        } else {
            next({ response: "mm-okay...mm-hmm thats bad!You should not forge rather... " });
        }
    },
    function (session, results) {
        if (results.response) {
            // ... save task
            session.send("'%s' ", results.response);
        } else {
            session.send("I don't think you are happy with my response so ...");
        }
    }
])

dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only schedule meetings."));
