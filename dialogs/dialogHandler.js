//Module to handle dialogs

let qAnda = require('../data.json');
module.exports = {
    helpDeskQuestionFinder : function (session,args,next) {
        let intentLst = args.intent;
        session.dialogData.HelpDeskIntent=intentLst;        
        session.dialogData.HelpDeskAnswer = qAnda.complianceqa.filter(function(val, index, array) {
            return val.intent === intentLst.intent;
        })
        console.log(intentLst);
        console.log(session.dialogData.HelpDeskAnswer);
        next();
    },
    helpDeskAnwser : function(session, results) {     
        session.send("Your intent was " + session.dialogData.HelpDeskIntent.intents[0].intent + " with probabality-" + session.dialogData.HelpDeskIntent.intents[0].score);
        session.send("Thanks for your question, we have an answer for you! " + session.dialogData.HelpDeskAnswer[0].answer);
        session.endDialog();
    },
    smalltalk: function (session, args){  
        var fulfillment =  builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
        if (fulfillment){
              var speech = fulfillment.entity;
              session.send(speech);
        }else{
          session.send('hehehe! had enuf with Small talk?! Come on! ');
        }
      }
}
