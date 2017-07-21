
/**
 * Module dependencies.
 */

var express    = require('express');
var http       = require('http');
var path       = require('path');
var handlebars = require('express3-handlebars');


//Define all views\webpages
var index   = require('./routes/index');
var scientist = require('./routes/scientist');
var citizen = require('./routes/citizen');
var map = require('./routes/map');
var login = require('./routes/login');
var help = require('./routes/help');
var about = require('./routes/about');

//Define the app
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/about', about.view);

//app.get('/science/:role', science.view);
// Example route
// app.get('/users', user.list);

//Server requirements
require('node-easel');
var util       = require('util'),
    server     = http.createServer(app),
    gameport   = 8080;
    server.listen(gameport);
