restify-api-validation
==================

```npm install restify-api-validation --save```

Contributition and enhancement to repository are most welcome.
You can use this like this

**file**: [`allValidation.js`](allValidation.js)
```'use strict';
var Joi = require('joi');


var validate = {
  login :{
    options: { flatten: true },
    body: {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(10)
    }
  },
  register : {
  options: { flatten: true },
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(10)
  }
}};
module.exports.validate =validate;
```
**file**: [`app.js`](app.js)
```
'use strict';

const restify = require("restify");
var validate = require('restify-api-validation');
var http = require('http');
var validation = require('./allValidator').validate;
global.httpErrors = restify.errors;

global.server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({
    mapParams: false
}));
server.use(restify.plugins.fullResponse());

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
server.post('/register', validate(validation.register), respond200);
// default errorhandler for express-validation
server.use(function (err, req, res, next) {
  res.status(400).json(err);
});


module.exports = server;
```
#Make sure to use thsi for error catching , tested in restify 5
```
server.on('restifyError', function(req, res, err, next) {
    // handle all errors passed to next here, whether it's Error or NotFoundError or anything that is an instance of Error
   res.status(err.status);
   res.json(err.errors); //res.send(err);
  });
```

**For more complex structure like this you can do validation**


If you have json structure like this

```
{
	"email":"himmsharma.99@gmail.com",
	"password":"12345",
	"userinfo":[
		{ "nickname":"himanshu"},
		{"nickname":"himm"}],
	"complexinfo":{
		"name":[
			{"firstname":"ram"},
			{"firstname":"shyam"}]
	}
}
```

then you can make validation json in the allValidation.js file like this.
info is the object like login and register in allValidation.js file . allValidation.js file is above.

 ```
var nickname = Joi.object().keys({
  nickname: Joi.string().required()
});

 var firstname = Joi.object().keys({
  firstname: Joi.string().required()
});
```

While working with header reminder to write in `lower case` letter.

```
info : {
  options: { flatten: true ,contextRequest : true},
   headers: {
      authorization: Joi.string().required()
   },
  body: {
    email: Joi.string().required().email(),
    userinfo :Joi.array().items(nickname).required(),
    complexinfo :Joi.object().keys({
                name: Joi.array().items(firstname).required()
                }).required()
  }
}
```
