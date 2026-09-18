const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const apiRouter = require('./routes/api');

const app = express();

// 1. Logging – first, so every request is logged (static files included)
app.use(logger('dev'));

// 2. Parsing – before any route that reads req.body or req.cookies
app.use(express.json());
app.use(cookieParser());

// 3. Static front end – serves public/index.html, CSS, JS, images
app.use(express.static(path.join(__dirname, 'public')));

// 4. JSON API – everything data-related lives under /api
app.use('/api', apiRouter);

// 5. 404 – only reached if nothing above responded
app.use((req, res, next) => {
  next(createError(404));
});

// 6. Error handler – must be last, and must have 4 arguments
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const isDev = req.app.get('env') === 'development';
  res.status(status).json({
    error: err.message,
    ...(isDev && { stack: err.stack })
  });
});

module.exports = app;