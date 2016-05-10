var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Bot builder
// var restify = require('restify');
var builder = require('botbuilder');
var helloBot = new builder.TextBot();

// create a model
var model = 'https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=d630263ca77f4a96b2efb66f40c279c0&q=';
var dialog = new builder.LuisDialog(model);
var cortonaBot = new builder.TextBot();
cortonaBot.add('/',dialog);

// Add intent handlers
dialog.on('builtin.intent.alarm.set_alarm', builder.DialogAction.send('Creating Alarm'));
dialog.on('builtin.intent.alarm.delete_alarm', builder.DialogAction.send('Deleting Alarm'));
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));

cortanaBot.listenStdin();
// var server = restify.createServer();

// var helloBot = new builder.BotConnectorBot();

helloBot.add('/',new builder.CommandDialog()
    .matches('^set name', builder.DialogAction.beginDialog('/profile'))
    .matches('^quit', builder.DialogAction.endDialog())
    .onDefault(function(session){
      if (!session.userData.name) {
        session.beginDialog('/profile');
      } else {
        session.send('Hello %s!', session.userData.name);
      }
    }));

/*
 helloBot.add('/', function (session) {
 if (!session.userData.name) {
 session.beginDialog('/profile');
 } else {
 session.send('Hello %s!', session.userData.name);
 }
 });
 */
helloBot.add('/profile', [
  function (session) {
    if (session.userData.name) {
      builder.Prompts.text(session, 'What would you like to change it to ?');
    }
    else{
      builder.Prompts.text(session, 'Hi! Tell me your name!');
    }


  },
  function (session, results) {
    session.userData.name = results.response;
    session.endDialog();
  }
]);
// server.use(helloBot.verifyBotFramework({ appId: '2202', appSecret: '8dbee11b68234e31b772e4ca56cb866b' }));
// server.post('/v1/messages', helloBot.listen());

// server.listen(8080, function () {
//     console.log('%s listening to %s', server.name, server.url);
// });
helloBot.listenStdin();
module.exports = app;
