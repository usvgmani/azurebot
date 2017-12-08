//Module to handle dialogs
var DialogHandler = require('./dialogHandler');
var HelpDeskQuestionFinder = DialogHandler.helpDeskQuestionFinder;
var HelpDeskAnwser = DialogHandler.helpDeskAnwser;
var smalltalkhandler = DialogHandler.smalltalk;
module.exports = {
    createLuisDialog : function (bot,name) {
       bot.dialog(name, [  HelpDeskQuestionFinder,  HelpDeskAnwser ]).triggerAction({ 
            matches: name
        });
    },
    startsmalltalkDialog : function (session,text, uuid,apiaiapp) {
        DialogHandler.smalltalk(session,text, uuid,apiaiapp);
     },
}