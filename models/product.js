const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    name: {
        type: String,
        required: false
    },
    old_price: {
        type: Number,
        required: false
    },
    tags: [
        {
            type: String,
            required: false
        }
    ],
    price: {
        type: Number,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    reviews: [
        {
        rating :{
            type: Number,
            required: false
        },
        comment: {
            type: String,
            required: false
        }
    }
    ],
    category: {
        type: String,
        required: false
    },
    image: {
        type: String
    },
    description: [
        {
        type: String,
        required: false
    }
    ],
    offers: [
        {
            type: String,
            required: false
        }
    ],
    EMI: {
        isAvailable: {
            type: Boolean,
            default: false
        },
        downPayment: {
            type: Number,
            required: false,
            default: 0
        },
        interest_Rate: {
            type: Number,
            required: false,
            default: 0
        }
    },    

    deliveryCharges: {
        type: Number,
        required: false,
        default: 0
    },
    
    stock: {
        isInStock: {
            type: Boolean,
            default: true
        },
        numberOfItems: {
            type: Number,
            required: false,
            default: 1
        }
    }
})

const Product = mongoose.model('Product',product)
module.exports = Product;