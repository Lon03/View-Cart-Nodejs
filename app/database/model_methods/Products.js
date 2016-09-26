const Products = require('../models/products.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shop')


var products = [
    new Products({
        image: 'http://reytingi.com/wp-content/uploads/2014/07/apple_iphone_5d7_enl.jpg'
        , title: 'Apple iPhone 5s'
        , price: '350'
    }),
    new
        Products({
        image: 'https://i5.walmartimages.com/asr/db6d232c-3741-4966-a394-cdd8325595c0_1.925157e6729837592155064818903550.jpeg'
        , title: 'Apple iPhone 6'
        , price: '600'
    }),
    new Products({
        image: 'http://i2.rozetka.ua/goods/1546919/apple_mm192rk_a_images_1546919655.jpg'
        , title: 'Apple A1489 iPad'
        , price: '850'
    }),
    new Products({
        image: 'http://vidopro.ua/upload/uploaded_images/633/550facce21d55_1.jpg'
        , title: 'Apple MacBook Pro Retina'
        , price: '2500'
    }),
    new Products({
        image: 'http://i2.rozetka.ua/goods/1510924/apple_mk482ua_a_images_1510924502.jpg'
        , title: 'Apple iMac 27'
        , price: '3300'
    }),
    new Products({
        image: 'http://www.newtime.com.ua/wp-content/uploads/2015/07/Space-Black-stianless-apple-watch.jpg'
        , title: 'Apple Watch 42mm'
        , price: '1050'
    }),
    new Products({
        image: 'http://img0.itbox.ua/prod_img/0/U0177970_big.jpg'
        , title: 'Marshall Major II Android'
        , price: '100'
    }),
    new Products({
        image: 'http://i2.rozetka.ua/goods/1674476/apple_zkmmfr2kra_images_1674476108.jpg'
        , title: 'Apple Watch Sport 42mm'
        , price: '750'
    })
]

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        console.log('******************')
        if (done === products.length) {
            exit();
        }
    })
}
function exit() {
    mongoose.disconnect();
}