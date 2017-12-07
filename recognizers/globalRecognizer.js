module.exports = {
    addGlobalRecognizer: function(bot){
        bot.recognizer({
            recognize: function (context, done) {
            var intent = { score: 0.0 };

                    if (context.message.text) {
                        switch (context.message.text.toLowerCase()) {             
                            case 'help':
                                intent = { score: 1.0, intent: 'Help' };
                                break;
                            case 'cancel':
                            case 'thanks':
                            case 'ok':
                            case 'fine':
                            case 'goodbye':
                                intent = { score: 1.0, intent: 'CancelIntent' };
                                break;
                        }
                    }
                    done(null, intent);
                }
            });
    }
}