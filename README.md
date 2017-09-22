restify-api-validation
==================

This module will help you to make resitfy validation in the concept of AndrewKeig/express-validation.'

Thanks for wonderful work down in `AndrewKeig/express-validation`

You can use this like this 

#allValidation.js
'use strict';
var Joi = require('joi');


var validate = {
  login :{
    options: { flatten: true },
    body: {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(10)
    }
  },
  register = {
  options: { flatten: true },
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(10)
  }
};
module.exports.validate =validate;

#app.js

'use strict';

const restify = require("restify");
const restifyBodyParser = require('restify-plugins').bodyParser;
const restifyacceptParser = require('restify-plugins').acceptParser;
const restifyqueryParser = require('restify-plugins').queryParser;
const restifyfullResponse = require('restify-plugins').fullResponse;
var validate = require('restify-api-validation');
var http = require('http');
var validation = require('./allValidation');
global.httpErrors = restify.errors;

global.server = restify.createServer();
server.use(restifyBodyParser());
server.use(restifyacceptParser(server.acceptable));
server.use(restifyqueryParser({
    mapParams: false
}));
server.use(restifyfullResponse());


server.listen(3000, function () {
    "use strict";
    console.log("server is up at 3000");
});

// generates a response function sending back to user the specified req[key]
function respondWith (key) {
  return function (req, res) {
    res.json(req[key]);
  };
}

function respond200 (req, res) {
  res.json(200);
}

server.post('/login', validate(validation.login), respond200);
server.post('/register', validate(validation.register), respond200);
// default errorhandler for express-validation
server.use(function (err, req, res, next) {
  res.status(400).json(err);
});


module.exports = server;
