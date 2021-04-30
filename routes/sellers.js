const express = require('express');
const sellersRouter = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/autenticateSeller');

const Seller = require('../models/seller');
const Product = require('../models/product');
const Waiting = require('../models/WaitingLobby');

sellersRouter.get('/', (req, res, next) => {                              //get all sellers
    Seller.find({})
        .populate('productsHeHas')
        .then((seller) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(seller);
        })
        .catch((err) => next(err));
})

sellersRouter.put('/', auth.verifySeller, (req, res, next) => {                                     //update a seller
    var cred = auth.sendCredientals();
    Seller.findByIdAndUpdate(cred._id, {
        $set: req.body
    }, { new: true })
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));
})

sellersRouter.delete('/', (req, res, next) => {                               //delete all sellers
    Seller.remove({})
        .then((sellers) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(sellers);
        })
        .catch((err) => next(err));
})

sellersRouter.get('/myProducts', auth.verifySeller, async function (req, res, next) {          //get products of the seller
    var creds = auth.sendCredientals();
    console.log(creds)
    var arr = new Array();
    await Seller.findById(creds._id)
        .then(async (seller) => {
            for (i = 0; i < seller.productsHeHas.length; ++i) {
                await Product.findById(seller.productsHeHas[i])
                    .then((product) => {
                        arr.push(product);
                    })
            }
        })
        .catch((err) => next(err));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(arr);
})

sellersRouter.post('/addPinCodes', auth.verifySeller, async function (req, res, next) {        //add pincode by the seller
    var cred = auth.sendCredientals();
    await req.body.forEach(pincode => {
        Seller.findByIdAndUpdate(
            { _id: cred._id },
            { $push: { pincodeHeDeliver: pincode } },
            { new: true },
            function (error, doc) {
                console.log('error is, ', error);
                console.log(JSON.stringify(doc));
            }
        )
    });
    Seller.findById(cred._id)
        .then((seller) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(seller);
        })
        .catch((err) => next(err));

})

sellersRouter.post('/deletePinCodes', auth.verifySeller, async function (req, res, next) {
    var cre = auth.sendCredientals();
    req.body.forEach(async (pincode) => {
        await Seller.findOneAndUpdate(
            { _id: cre._id },
            { $pull: { pincodeHeDeliver: pincode } },
            { new: true },
            function (error, doc) {
                console.log('error is, ', error);
                console.log(JSON.stringify(doc));
            }
        )
    })
    Seller.findById(cre._id)
        .then((seller) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(seller);
        })
        .catch((err) => next(err));
})

sellersRouter.post('/login', async (req, res, next) => {                      //login for seller
    try {
        var u = await Waiting.findOne({ phone: req.body.phone });
        if (u) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({ msg: "Seller hasn't been approved by the admin yet" });
        } else {
            Seller.findOne({ phone: req.body.phone }, async (err, usr) => {

                if (!usr) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ msg: "Seller doesnt exist" });
                }
                bcrypt.compare(req.body.password, usr.password, async function (err, isMatch) {

                    if (isMatch) {
                        const token = await usr.generateAuthToken()
                        const id = usr._id;
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ success: true, status: 'Login Successful', token: token, id: id })
                    }
                    else if (!isMatch) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ msg: "Password or Phone Number incorrect" });
                    }

                })

            })



        }
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = sellersRouter;

