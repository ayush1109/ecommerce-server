var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/users');
var Product = require('../models/product');
var authenticate = require('../middlewares/authenticateUser');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function (req, res, next) {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err })
    }
    else {
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      user.joined_on = new Date().toLocaleDateString();
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return ;
        }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful' })
          });
      });

    }
  });
});


router.post('/login', (req, res, next) => {                   //login user

  passport.authenticate('local', (err, user, info) => {
    if (err) 
      return next(err);

    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: 'Login Unsuccessful!', err: info})
    }

    req.logIn(user, (err) => {
      if(err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: 'Login Unsuccessful', err: 'Could not login user'})
      }

      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Login Successful!!!', token: token, id: req.user._id})

    })
  }) (req, res, next);

  
});



router.get('/logout',(req, res, next) => {               //logout user
  console.log("user is : " , req.user);
      req.token = '*';
  console.log("user is : " ,req.user);
  res.send(" logged  out ");
})

router.get('/search', function (req, res, next) {               //get products on search
  var arr = new Array();
  console.log('in query')
  console.log(req.query.query);
   Product.find({})
    .then((product) => {
      product.map((pro) => {
        if (pro.category == req.query.query) {
          arr.push(pro);
        }
        if (pro.name == req.query.query) {
          arr.push(pro);
        }
        if(pro.company_name == req.query.query) arr.push(pro);
        pro.tags.forEach((tag) => {
          if(req.query.query == tag) arr.push(pro);
        })
      })
      res.statusCode = 200;
      console.log(arr, 'line 108')
      res.setHeader('Content-Type', 'application/json');
      res.json(arr);
  })
    .catch((err) => next(err));
  
})

router.post('/changePassword', function (req, res, next)  {               //change password
  User.findById(req.user._id)
  .then((user) => {
      user.password = req.body.password;
      user.save()
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      })
  })
})


router.put('/', authenticate.verifyUser, (req, res, next) => {                 //update a user
  User.findByIdAndUpdate(req.user._id, {
    $set: req.body
}, { new: true })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => next(err));
})
module.exports = router;
