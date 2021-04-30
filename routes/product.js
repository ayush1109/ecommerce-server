const express = require('express');
const productRouter = express.Router();
const auth = require('../middlewares/autenticateSeller');
const Product = require('../models/product');
const Seller = require('../models/seller');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


productRouter.get('/', (req, res, next) => {           //get all products
    Product.find({})
        .then((products) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(products);
        })
        .catch((err) => next(err));
})

productRouter.post('/', auth.verifySeller, async (req, res, next) => {            //insert a product or products
    var cre = auth.sendCredientals();
    console.log('cre', cre);
    console.log(req.body);
    await req.body.forEach((product) => {
        Product.create(product)
            .then(async (pro) => {
                var id = pro._id;
                console.log(typeof id);
                Seller.findOneAndUpdate(
                    { _id: cre._id },
                    { $push: { productsHeHas: id } },
                    function (error, success) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(success);
                        }
                    });
            })
            .catch((err) => next(err));
    })
    Seller.findById(cre._id)
        .populate('Product')
        .then((seller) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(seller);  
        })
})

productRouter.delete('/', auth.verifySeller, (req, res, next) => {           //delete multiple products
    var cre = auth.sendCredientals();
        console.log(cre);
        req.body.forEach((element) => {
            Product.findByIdAndRemove(element)
            .then((resp) => {
                Seller.findOneAndUpdate(
                    { _id: cre._id },
                    { $pull: { productsHeHas: element } },
                    {new : true},
                    function (error, doc) {
                        console.log('error is, ', error);
                        console.log(JSON.stringify(doc));
                    }
                    )
                    
            })
            .catch((err) => next(err));
        })
        Seller.findById(cre._id)
        .then((seller) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(seller);
        })
        .catch((err) => next(err));
        
})

productRouter.delete('/deleteAll', auth.verifySeller, (req, res, next) => {           ///delete all products
    var cre = auth.sendCredientals();
    Product.remove({})
        .then((resp) => {
            Seller.findByIdAndUpdate(
                {_id: cre._id},
                {$set: {productsHeHas: []}},
                {new: true},
                function (error, doc) {
                    console.log('error is, ', error);
                    console.log(JSON.stringify(doc));
                }
            )
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));
})

productRouter.route('/:productId')

    .get((req, res, next) => {                                //get a particular product
        Product.findById(req.params.productId)
            .then((product) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            })
            .catch((err) => next(err));
    })

    .put(auth.verifySeller, (req, res, next) => {                                     //update a product
        
        Product.findByIdAndUpdate(req.params.productId, {
            $set: req.body
        }, { new: true })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
            .catch((err) => next(err));
    })

    .delete(auth.verifySeller, (req, res, next) => {                                   //delete a product
        var cre = auth.sendCredientals();
        console.log(cre);
        Product.findByIdAndRemove(req.params.productId)
            .then((resp) => {
                Seller.findOneAndUpdate(
                    { _id: cre._id },
                    { $pull: { productsHeHas: req.params.productId } },
                    {new : true},
                    function (error, doc) {
                        console.log('error is, ', error);
                        console.log(JSON.stringify(doc));
                    }
                    )
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
            })
            .catch((err) => next(err));
    })

module.exports = productRouter;

