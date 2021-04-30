const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatars = new Schema({
    img: {data: Buffer, contentType: String}
})

const Avatars = mongoose.model('Avatars', avatars)
module.exports = Avatars;