const express = require('express');
const sellerRouter = express.Router();
const auth = require('../middlewares/autenticateSeller');

const Seller = require('../models/seller');

sellerRouter.delete('/:sellerId', (req, res, next) => {                                   //delete a seller
    Seller.findByIdAndRemove(req.params.sellerId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));
})


sellerRouter.get('/:sellerId', (req, res, next) => {                                //get a particular seller                                   
    Seller.findById(req.params.sellerId)
    .populate('productsHeHas')
        .then((seller) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(seller);
        })
        .catch((err) => next(err));
})

module.exports = sellerRouter;