/*********************************************************************
 *                        Module dependencies
 *********************************************************************/
const passport = require('passport');
const User = require('../database/models/user');
const LocalStrategy = require('passport-local').Strategy;
const Promise = require('bluebird');

/*********************************************************************
 *                Tell passport how to store User
 *********************************************************************/

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


/*********************************************************************
 *                Signup Strategy ||  User Creation
 *********************************************************************/

passport.use('local.signup', new LocalStrategy({
        usernameField: 'email'
        , passwordField: 'password'
        , passReqToCallback: true
    }, function (req, email, password, done) {

        // Next lines are for email validation using express-validator package

        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid passport').notEmpty().isLength({min: 4});
        var errors = req.validationErrors();
        if (errors) {
            var message = [];
            errors.forEach(function (error) {
                message.push(error.msg)
            })
            return done(null, false, req.flash('error', message))
        }
        return new Promise(function (resolve, reject) {
            User.findOne({'email': email}).exec()
                .then(function (user) {

                    if (user) {
                        resolve(done(null, false, {message: 'Email already taken!'}));
                    }
                    else {
                        var newUser = new User();

                        newUser.email = email;
                        newUser.password = newUser.encryptPassword(password);
                        return newUser.save();
                    }
                })
                .then(function (user) {
                    resolve(done(null, user));
                })
                .catch(function (err) {
                    reject(done(err));
                });
        })
    }
));

/*********************************************************************
 *                            Signin Strategy
 *********************************************************************/

passport.use('local.signin', new LocalStrategy({
        usernameField: 'email'
        , passwordField: 'password'
        , passReqToCallback: true
    }, function (req, email, password, done) {

        // Next lines are for email validation using express-validator package

        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid passport').notEmpty().isLength({min: 4});
        var errors = req.validationErrors();
        if (errors) {
            var message = [];
            errors.forEach(function (error) {
                message.push(error.msg)
            })
            return done(null, false, req.flash('error', message))
        }
        return new Promise(function (resolve, reject) {
            User.findOne({'email': email}).exec()
                .then(function (user) {

                    if (!user) {
                        resolve(done(null, false, {message: 'User not found!'}));
                    }
                    if (!user.validPassword(password)) {
                        resolve(done(null, false, {message: 'Incorrect password!'}));
                    }
                    resolve(done(null, user))
                })
                .catch(function (err) {
                    reject(done(err));
                });
        })
    }
));