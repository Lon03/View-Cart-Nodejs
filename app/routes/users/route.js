/*********************************************************************
 *                        Module dependencies
 *********************************************************************/
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport')
const controller = require('./controller');

// Session security
const csrfProtection = csrf();
router.use(csrfProtection);

router.route('/')
    .get(controller.apiGet)
router.route('/user/signup')
    .get(controller.getSignUp)
router.route('/user/signup')
    .post(controller.postSignUp)
router.route('/user/signin')
    .get(controller.notEnsureAuthenticated, controller.getSignIn)
router.route('/user/signin')
    .post(controller.postSignIn)
router.route('/user/loggout')
    .get(controller.getLoggout)
router.route('/user/profile')
    .get(controller.ensureAuthenticated, controller.getProfile)
router.route('/buy:id')
    .get(controller.getBuy)
router.route('/user/view-cart')
    .get(controller.getViewCart)

module.exports = router;
