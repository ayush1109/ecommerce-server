const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const user = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        house: String,
        sector:String,
        landmark: String,
        city: String,
        state: String
    },
    pincode: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    joined_on: {
        type: String,
        required: false
    },
    myCart: [
        {
        addedOn: {
            type: String,
            required: false
        },
        number: {
            type: Number,
            required: false
        },
        cart: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
    }
    ],
    myFavorites: [
        {
        addedOn: {
            type: String,
            required: false
        },
        favorites: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
    }
    ],
    myWishlist: [
        {
        addedOn: {
            type: String,
            required: false
        },
        wishlist: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
    }
    ],
    myOrders: [
        {
        addedOn: {
            type: String,
            required: false
        },
        orders: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        
    }
    ]

})

user.plugin(passportLocalMongoose);

const User = mongoose.model('User', user)
module.exports = User;