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
    createsmalltalkDialog : function (bot,name) {
        bot.dialog(name, [  smalltalkhandler ]).triggerAction({ 
             matches: name
         });
     },
}