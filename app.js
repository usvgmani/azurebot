let restify = require('restify');
let builder = require('botbuilder');
let qAnda = require('./data.json')
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
// Utility Functions
//////////////////////////////////////////////////////////////////////////////////////

function HelpDeskQuestionFinder(session,args,next) {
    let intentLst = args.intent;
    session.dialogData.HelpDeskIntent=intentLst;        
    session.dialogData.HelpDeskAnswer = qAnda.complianceqa.filter(function(val, index, array) {
        return val.intent === intentLst.intent;
    })
    console.log(intentLst);
    console.log(session.dialogData.HelpDeskAnswer);
    next();
}
function HelpDeskAnwser(session, results) {
    session.send("Your intent was " + session.dialogData.HelpDeskIntent.intents[0].intent + " with probabality-" + session.dialogData.HelpDeskIntent.intents[0].score);
    session.send("Thanks for your question, we have an answer for you! " + session.dialogData.HelpDeskAnswer[0].answer);
    session.endDialog();
}
//=========================================================
// Bots Dialogs
//////////////////////////////////////////////////////////////////////////////////////
let bot = new builder.UniversalBot(connector, function (session, args) {
    session.send("Please rephrase your question!");  
});
// Add global LUIS recognizer to bot https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4ee50075-25c9-495b-877e-ec48f4a0a837?subscription-key=4db27f29310b4779a2d1b60775dfcbd6&staging=true&verbose=true&timezoneOffset=0&q=	
let luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4ee50075-25c9-495b-877e-ec48f4a0a837?subscription-key=4db27f29310b4779a2d1b60775dfcbd6&staging=true&verbose=true&timezoneOffset=0&q=';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));
// CRD number  dialog
bot.dialog('compliancehelpdesk.WHERE_CRD_NO', [  HelpDeskQuestionFinder,  HelpDeskAnwser ]).triggerAction({ 
    matches: 'compliancehelpdesk.WHERE_CRD_NO',
    confirmPrompt: "This will cancel the creation of the note you started. Are you sure?" 
});
bot.dialog('compliancehelpdesk.HOW_COMPLETE_FINRA_CE', [ HelpDeskQuestionFinder,  HelpDeskAnwser ]).triggerAction({ 
    matches: 'compliancehelpdesk.HOW_COMPLETE_FINRA_CE',
    confirmPrompt: "This will cancel the creation of the note you started. Are you sure?" 
});
bot.dialog('compliancehelpdesk.DID_I_COMPLETE_FINRA', [ HelpDeskQuestionFinder,  HelpDeskAnwser]).triggerAction({ 
    matches: 'compliancehelpdesk.DID_I_COMPLETE_FINRA',
    confirmPrompt: "This will cancel the creation of the note you started. Are you sure?" 
});
bot.dialog('compliancehelpdesk.DECLARE_INVESTMENTS', [ HelpDeskQuestionFinder,  HelpDeskAnwser]).triggerAction({ 
    matches: 'compliancehelpdesk.DECLARE_INVESTMENTS',
    confirmPrompt: "This will cancel the creation of the note you started. Are you sure?" 
});
bot.dialog('compliancehelpdesk.MMC_CASE_STATUS', [ HelpDeskQuestionFinder,  HelpDeskAnwser]).triggerAction({ 
    matches: 'compliancehelpdesk.MMC_CASE_STATUS',
    confirmPrompt: "This will cancel the creation of the note you started. Are you sure?" 
});