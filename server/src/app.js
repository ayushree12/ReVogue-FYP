const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const apiRouter = require('./routes/api.routes');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(rateLimiter);

app.use('/api/v1', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;
