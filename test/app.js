'use strict';

const restify = require("restify");
const restifyBodyParser = require('restify-plugins').bodyParser;
const restifyacceptParser = require('restify-plugins').acceptParser;
const restifyqueryParser = require('restify-plugins').queryParser;
const restifyfullResponse = require('restify-plugins').fullResponse;
var validate = require('../lib/index');
var http = require('http');
var validation = require('./validation');
global.httpErrors = restify.errors;

global.server = restify.createServer();
server.use(restifyBodyParser());
server.use(restifyacceptParser(server.acceptable));
server.use(restifyqueryParser({
    mapParams: false
}));
server.use(restifyfullResponse());

server.on('restifyError', function(req, res, err, next) {
    // handle all errors passed to next here, whether it's Error or NotFoundError or anything that is an instance of Error
   res.status(err.status);
   res.json(err.errors); //res.send(err);
  });
  
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
server.get('/user', validate(validation.user.get), respond200);
server.get('/search', validate(validation.search), respond200);
server.put('/user/:id', validate(validation.user.put), respond200);
server.post('/register', validate(validation.register.post), respond200);
server.post('/options', validate(validation.options), respond200);
server.get('/account/:id', validate(validation.account), respondWith('params'));
server.post('/defaults', validate(validation.defaults), respondWith('body'));

server.get('/parsing/params/:id?', validate(validation.parsing.params), respondWith('params'));
server.get('/parsing/query', validate(validation.parsing.query), respondWith('query'));
server.post('/parsing/body', validate(validation.parsing.body), respondWith('body'));
server.get('/parsing/headers', validate(validation.parsing.headers), respondWith('headers'));
server.get('/parsing/cookies', validate(validation.parsing.cookies), respondWith('cookies'));

server.post('/logout', validate(validation.logout), respond200);
server.post('/array', validate(validation.array), respond200);
server.post('/context/:id', validate(validation.context), respond200);

// default errorhandler for express-validation
server.use(function (err, req, res, next) {
  res.status(400).json(err);
});


module.exports = server;
