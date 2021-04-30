const express = require('express');
const waitingRouter = express.Router();
const bcrypt = require('bcryptjs');
const Seller = require('../models/seller');
const Product = require('../models/product');
const Waiting = require('../models/WaitingLobby');

waitingRouter.get('/', function (req, res, next) {
    Waiting.find({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);       
    })
    .catch((err) => next(err));
})

waitingRouter.post('/signup', async function (req, res, next) {          //seller signup in waiting lobby
    console.log('in waiting signup')    
    try{
        var u = await Waiting.findOne({ phone: req.body.phone });
        if (u) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:"phone no. already exists"});
        }
        
        bcrypt.genSalt(10, function (err, Salt) {
            bcrypt.hash(req.body.password, Salt, function (err, hash) {
                var user =  new Waiting({
                    name: req.body.name,
                    phone: req.body.phone,
                    info: req.body.info,
                    password: hash
                })
        
                user.save().then(() => {
        
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({user, success: true});
                })
        
        
            })
        })
        }catch(e){
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:"error"});
        }
})

waitingRouter.post('/approveRequest/:waitingId', function(req, res, next) {              //approve a request
    Waiting.findById(req.params.waitingId)
        .then((user) => {  console.log(data)
            if (req.body != null) {
              var data={
                name:user.name,
                phone:user.phone,
                password:user.password,
                joined_on: new Date().toLocaleDateString(),
                email : user.email
              }; 

                Seller.create(data)
                    .then((sel) => {
                        console.log(data);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(sel);
                    })
                    .then(() => {
                        Waiting.findByIdAndRemove(req.params.waitingId)
                            .then(() => {
                                console.log('record deleted')
                            })
                    })
                    .catch((err) => next(err));
            }
        })
})

waitingRouter.delete('/disapproveRequest/:waitingId', function (req, res, next) {         //disapprove(delete) a request
    Waiting.findByIdAndRemove(req.params.waitingId)
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch((err) => next(err));
})

waitingRouter.delete('/disapproveAll', function (req, res, next) {              //disapprove(delete) all requests
    Waiting.remove({})
    .then((records) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(records);

    })
    .catch((err) => next(err));
})

module.exports = waitingRouter;