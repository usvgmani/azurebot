'use strict';

// var apiai = require("../module/apiai");
var apiai = require("apiai");

var app = apiai("a9c2fa56d15b49a69304e38ababe493a");

var options = {
    sessionId: 'c245739b-1ec2-4817-bb23-e8ccc63a784f'
};

var request = app.textRequest('Hello', options);

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();