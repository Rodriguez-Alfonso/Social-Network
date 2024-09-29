const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

module.exports = errorHandler;