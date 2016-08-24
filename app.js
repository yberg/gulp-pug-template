var express = require('express');
var app = express();
var path = require('path');

var basedir = path.join(__dirname, 'builds/development');

app.use('/css', express.static(basedir + '/css'));
app.use('/js', express.static(basedir + '/js'));

app.get('/', (req, res) => {
  res.sendFile(basedir + '/index.html');
});

app.set('view engine', 'jade');
app.set('views', __dirname + '/src/views');

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
      error: err,
      status: err.status
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    status: err.status
  });
});

var port = Number(process.env.PORT || '3000');

var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

});