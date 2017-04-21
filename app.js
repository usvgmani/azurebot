var restify = require('restify');
var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer');
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
//var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b2aeee67-84d0-4c4a-8722-343cafa0ffe6?subscription-key=4db27f29310b4779a2d1b60775dfcbd6&verbose=true&timezoneOffset=0.0&spellCheck=false&q=';
//var recognizer = new builder.LuisRecognizer(model);
//var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

var recognizer = new apiairecognizer('8986813ad34a4719ac401658dfe5b0e5');
var intents = new builder.IntentDialog({
    recognizers: [recognizer]
});

function smalltalk(session, args){  
  var fulfillment =  builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
  if (fulfillment){
        var speech = fulfillment.entity;
        session.send(speech);
  }else{
    session.send('hehehe! had enuf with Small talk?! Come on! ');
  }
}

bot.dialog('/',intents);

// Add intent handlers
intents.matches('AnWeatherIntent',function(session){
    session.send("Sunny... may snow in 10 seconds... windy at 15000 miles/sec ..halestorm.. thunderstorm.. do you see Thor!");
});
intents.matches('smalltalk.greetings', smalltalk);
intents.matches('smalltalk.agent', smalltalk);
intents.matches('smalltalk.appraisal', smalltalk);
intents.matches('smalltalk.dialog', smalltalk);
intents.matches('smalltalk.emotions', smalltalk);
intents.matches('smalltalk.person', smalltalk);
intents.matches('smalltalk.topics', smalltalk);
intents.matches('smalltalk.user', smalltalk);
intents.matches('smalltalk.unknown', smalltalk);
intents.matches('WhatHappensIfIntent',  [
    function (session, args, next) {       
        var forgesignature = builder.EntityRecognizer.findEntity(args.entities, 'Whatif_forgesignature');
        if (!forgesignature) {
            builder.Prompts.text(session, "hmm thats a good question!");
        } else {
            next({ response: "mm-okay...mm-hmm thats bad!You should not forge rather... " });
        }
    },
    function (session, results) {
        if (results.response) {
            session.send("'%s' ", results.response);
        } else {
            session.send("I don't think you are happy with my response so ...");
        }
    }
])
intents.onDefault(function(session){
    session.send("Sorry...can you please rephrase?");
});
