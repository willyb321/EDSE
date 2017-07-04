const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const Raven = require('raven');
const responseTime = require('response-time');
const compression = require('compression');

const index = require('./routes/index');
const result = require('./routes/result');

Raven.config('https://813ced5f5d4d4ef5a389190165585e6b:7f3b9eba91fd4454929da55351ab59b3@sentry.io/186063').install();

const app = express();
app.use(Raven.requestHandler());
app.use(compression());
app.use(responseTime());
const cacheTime = 8640000;
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: true, // True = .sass and false = .scss
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public'), {
	maxAge: cacheTime,
	etag: true
}));

app.use('/', index);
app.use('/result', result);

app.use(Raven.errorHandler());
app.use((err, req, res, next) => {
	// The error id is attached to `res.sentry` to be returned
	// and optionally displayed to the user for support.
	res.statusCode = 500;
	res.end(res.sentry + '\n');
});
// Catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
