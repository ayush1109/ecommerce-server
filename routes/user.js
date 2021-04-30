var express = require('express');
var userRouter = express.Router();
var User = require('../models/users');



userRouter.get('/:userId', (req, res, next) => {                  //get a user
    User.findById(req.params.userId)
    .populate('myCart.cart')
    .populate('myFavorites.favorites')
    .populate('myOrders.orders')
    .populate('myWishlist.wishlist')
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    })
    .catch((err) => next(err));
})

module.exports = userRouter;