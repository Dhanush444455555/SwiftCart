// Express 5-compatible error handler (4 args required)
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// notFound is kept for manual use but skipped in Express 5 when a catch-all exists
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
