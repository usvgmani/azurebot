//Module to handle dialogs
var DialogHandler = require('./dialogHandler');
var HelpDeskQuestionFinder = DialogHandler.helpDeskQuestionFinder;
var HelpDeskAnwser = DialogHandler.helpDeskAnwser;

module.exports = {
    createLuisDialog : function (bot,name) {
       bot.dialog(name, [  HelpDeskQuestionFinder,  HelpDeskAnwser ]).triggerAction({ 
            matches: name
        });
    }
}