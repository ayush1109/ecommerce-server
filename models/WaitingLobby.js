const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waiting = new Schema({
    name: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    info: {
        type:String,
        required: false
    }
})

const Waiting = mongoose.model('Waiting', waiting);
module.exports = Waiting;