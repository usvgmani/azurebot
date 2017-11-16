let restify = require('restify');
let builder = require('botbuilder');
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
    appId:null,
    appPassword:null    
});
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//////////////////////////////////////////////////////////////////////////////////////
// Create your bot with a function to receive messages from the user.
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
let bot = new builder.UniversalBot(connector, function (session, args) {
    session.send("Hi... Welcome to Compliance Chat Bot, your questions can be 'How do I perform' 'What happens if' When does' 'Who is'");

   // If the object for storing notes in session.userData doesn't exist yet, initialize it
   if (!session.userData.notes) {
       session.userData.notes = {};
       console.log("initializing userData.notes in default message handler");
   }
});
// Add global LUIS recognizer to bot
let luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4ee50075-25c9-495b-877e-ec48f4a0a837?subscription-key=4db27f29310b4779a2d1b60775dfcbd6&staging=true&verbose=true&timezoneOffset=0&q=';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));
// CreateNote dialog
bot.dialog('ComplianceHelpDesk', [
    function (session, args, next) {
        // Resolve and store any Note.Title entity passed from LUIS.
        let intent = args.intent;
        let title = builder.EntityRecognizer.findEntity(intent.entities, 'ComplianceNote.Subject');
        console.log(intent);
        let note = session.dialogData.note = {
          title: title ? title.entity : null,
        };
        
        // Prompt for title
        if (!note.title) {
            builder.Prompts.text(session, 'What would you like to call your note?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        let note = session.dialogData.note;
        if (results.response) {
            note.title = results.response;
        }

        // Prompt for the text of the note
        if (!note.text) {
            builder.Prompts.text(session, 'What would you like to say in your note?');
        } else {
            next();
        }
    },
    function (session, results) {
        let note = session.dialogData.note;
        if (results.response) {
            note.text = results.response;
        }
        
        // If the object for storing notes in session.userData doesn't exist yet, initialize it
        if (!session.userData.notes) {
            session.userData.notes = {};
            console.log("initializing session.userData.notes in CreateNote dialog");
        }
        // Save notes in the notes object
        session.userData.notes[note.title] = note;

        // Send confirmation to user
        session.endDialog('Creating note named "%s" with text "%s"',
            note.title, note.text);
    }
]).triggerAction({ 
    matches: 'ComplianceNote.Create',
    confirmPrompt: "This will cancel the creation of the note you started. Are you sure?" 
}).cancelAction('cancelCreateNote', "Note canceled.", {
    matches: /^(cancel|nevermind)/i,
    confirmPrompt: "Are you sure?"
});
