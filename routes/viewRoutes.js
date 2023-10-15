const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/me', authController.protect, viewController.getMe);
router.get(
  '/myBookings',
  authController.protect,
  bookingController.getMyBookings,
);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewController.updateUserData,
// );
router
  .route('/login')
  .get(authController.isLoggedIn, viewController.getLoginForm);
module.exports = router;
