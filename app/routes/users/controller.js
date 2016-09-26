/*********************************************************************
 *                        Module dependencies
 *********************************************************************/
const passport = require('passport');
const Cart = require('../../database/models/cart')
const Product = require('../../database/models/products')


exports.apiGet = apiGet;
exports.getSignUp = getSignUp;
exports.postSignUp = postSignUp;
exports.getSignIn = getSignIn;
exports.postSignIn = postSignIn;
exports.getProfile = getProfile;
exports.getLoggout = getLoggout;
exports.ensureAuthenticated = ensureAuthenticated;
exports.notEnsureAuthenticated = notEnsureAuthenticated;
exports.getBuy = getBuy;
exports.getViewCart = getViewCart;



/* Get home page. */
function apiGet(req, res, next) {
    Product.find(function (err, data) {
        /* add 4 bootstrap columns in row and loop*/
        var productBlocks = [];
        var blockSize = 4;
        for (var i = 0; i < data.length; i += blockSize) {
            productBlocks.push(data.slice(i, i + blockSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productBlocks});
    });
}

// User Profile

function getProfile(req, res, next) {
    res.render('user/profile');
}

// User SignUp

function getSignUp(req, res, next) {
    let messages = req.flash('error')
    res.render('user/signup', {title: 'User sign Up', csrfToken: req.csrfToken(), messages: messages});
}

function postSignUp(req, res, next) {
    passport.authenticate('local.signup', {
        successRedirect: '/user/profile'
        , failureRedirect: '/user/signup'
        , failureFlash: true
    })(req, res, next)
}

function getSignIn(req, res, next) {
    let messages = req.flash('error')
    res.render('user/signin', {title: 'User sign In', csrfToken: req.csrfToken(), messages: messages});
}

function postSignIn(req, res, next) {
    passport.authenticate('local.signin', {
        successRedirect: '/user/profile'
        , failureRedirect: '/user/signin'
        , failureFlash: true
    })(req, res, next)
}

function getBuy(req, res, next) {
    var productId = req.params.id;

    // Create New View Cart || If a Cart exists within session then use that cart else pass an empty object to start fresh

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        // Add new product to cart.
        cart.add(product, product.id);

        // Store Cart with global cart within session.
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    })
}

function getViewCart(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/viewCart', {products: null})
    }
    let cart = new Cart(req.session.cart);
    res.render('shop/viewCart', {products: cart.generateArray(), totalPrice: cart.totalPrice})

}

function getLoggout(req, res, next) {
    req.logout();
    res.redirect('/');
}

// Checks if Authenticated in and protects routes
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

// Checks if not Authenticated in and protects routes
function notEnsureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}