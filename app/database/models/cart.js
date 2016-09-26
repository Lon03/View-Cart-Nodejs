// Get data from old cart

module.exports = function Cart(oldCart) {

    // Gathers data from oldCart and assigns it

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    // on add || if not added then add item to storedItem

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }

        // if item is already added then increase the quantity

        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        var totPrice = parseInt(this.totalPrice);
        var storeItemPrice = parseInt(storedItem.item.price);
        this.totalPrice = totPrice + storeItemPrice;
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};