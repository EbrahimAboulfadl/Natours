const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All tours', tours });
});
exports.getMe = (req, res, next) => {
  res.status(200).render('account', { title: ' me' });
};

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
  });
  // if (!tour) return next(new AppError('there is no tour with that name', 404));
  res.status(200).render('tour', { title: tour.name, tour });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log in to your account' });
};
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      email: req.body.email,
      name: req.body.name,
    },
    { new: true, runValidators: true },
  );
  res.status(200).render('account', { user: updatedUser });
});
