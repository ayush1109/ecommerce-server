const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const Schema = mongoose.Schema;

const seller = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Avatars'
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: false
    },
    earnings: {
        type: Number
    },
    cancelled_orders: {
        type: Number
    },
    location: {
        type: String,
        required: false
    },
    supportEmail: {
        type: String,
        required: false
    },
    productsHeHas: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    pincodeHeDeliver: [
        {
            type: Number,
            required: false
        }
    ],
    joined_on: {
        type: String,
        required: false
    }
})

seller.methods.generateAuthToken=async function(){
    const usr=this;
    const token= jwt.sign({_id:usr._id.toString()},process.env.JWT, {expiresIn: 360000});
    return token;
  }
  

const Seller = mongoose.model('Seller', seller);
module.exports = Seller;