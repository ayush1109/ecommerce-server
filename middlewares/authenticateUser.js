const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

var secret = process.env.SECRET;
var User = require('../models/users');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, secret,
        {expiresIn:36000});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err) {
                return done(err, false);
            }
            else if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false})



// exports.verifySame = (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         r = req.user._id.toString();
//         au = dish.comments.id(req.params.commentId).author._id.toString();
//     })
//     if(au != r){
//         res.status(403).send('not same');
//     }
//     next();
// }