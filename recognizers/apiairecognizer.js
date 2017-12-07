module.exports = {
    addAPIAIRecognizer: function(bot, apiaiapp, uuid){
        bot.recognizer({
            recognize: function (context, done) {
                var intent = { score: 0.0 };
                if (context.message.text) {
                    let asessionid =uuid();
                    let request = apiaiapp.textRequest(context.message.text, {
                        sessionId: asessionid
                    });
                    request.on('response', function(response) {
                        console.log(response);
                        intent = { score: 1.0, intent: 'SmalltalkIntent', smalltalkresponse:response };
                    });
                    request.on('error', function(error) {
                        console.log(error);
                    });                   
                }
                done(null, intent);
            }
        });
    }
}