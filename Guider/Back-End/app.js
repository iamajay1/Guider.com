//Including Express Module....
var express = require('express');

//creating an Instance of Express Module...
var app = express();

//Including Mongoose for databse connectivity...
var mongoose = require('mongoose');

//Including body-parser to parse the header
var bodyParser = require('body-parser');

//Including cookie-parser to parse the cookie...
var cookieParser = require('cookie-parser');

//Create a session middleware....
var session = require('express-session');

//Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
var methodOverride = require('method-override');

//Including path module to include static files...
var path = require('path');

//includig file system to read and write files...
var fs = require('fs');

//Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be 
//requested from another domain outside the domain from which the first resource was served.
var cors = require('cors');

//HTTP request logger middleware for node.js
var logger = require('morgan');

// Including Helmet For Security
var helmet = require('helmet');
//using cors for cross origin file sharing
app.use(cors());
//using helmet for secure the site
app.use(helmet());
//parsing  and cookie middlewares
app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

app.use(cookieParser());
//----------------------------------for put method----------------------------------------
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//public folder as static
app.use(express.static(path.resolve(__dirname, './../Front-End')));

//Including User model and Ticket Model
var userModel = require('./app/models/User');
var ticketModel = require('./app/models/Ticket');

//including controller files
var userRouter = require('./app/controllers/userRouter');
app.use('/users', userRouter);

//Including Ticket files
var ticketRoute = require('./app/controllers/ticket');
app.use('/tickets', ticketRoute);

//Setting port to 1993..
var port = 1993;

//to log HTTP Requests..
app.use(logger('dev'));

//Data Base Connection
var dbPath = "mongodb://localhost/SupportApp";
mongoose.connect(dbPath);
mongoose.connection.once('open', function () {
    console.log("Connected To Database Successfully!");
});

//handling 404 error.
app.use(function (req, res, next) {
    res.status(404);
    // respond with json
    if (req.accepts('json')) {
        res.send({
            error: 'Not found'
        });
        return;
    }
    res.send('Not found');
});

//Listening on port 1993
app.listen(port, function () {
    console.log("Listening on port :" + port);
});
