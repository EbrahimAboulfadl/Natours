const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateNameDB = (err) => {
  const message = `there is already a tour with the name :${err.keyValue.name}`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Input Date: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJwtError = () =>
  new AppError('Invalid Token Please Login Again', 401);
const handleExpiredJwtToken = () =>
  new AppError('your token has expired, please login again');
const sendErrorDev = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    res
      .status(err.statusCode)
      .render('error', { title: 'Something went wrong', msg: err.message });
  }
};

const sendErrorProd = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //OPERATIONAL TRUSTED ERROR
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
      //PROGRAMING OR OTHER UNKNOWN ERROR (DON'T LEAK ERROR INFORMATION)
    } else {
      //1) LOG ERROR INFO TO THE CONSOLE
      console.error('ERROR', err);
      //2) SEND RESPONSE TO THE CLIENT
      res
        .status(500)
        .json({ status: 'error', message: 'Something went wrong' });
    }
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).render('error', { msg: err.message });
      //PROGRAMING OR OTHER UNKNOWN ERROR (DON'T LEAK ERROR INFORMATION)
    } else {
      //1) LOG ERROR INFO TO THE CONSOLE
      console.error('ERROR', err);
      //2) SEND RESPONSE TO THE CLIENT
      res
        .status(500)
        .render('error', {
          msg: 'Something went wrong, please try again later',
        });
    }
  }
};
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateNameDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleExpiredJwtToken();
    sendErrorProd(error, req, res);
  }
};
