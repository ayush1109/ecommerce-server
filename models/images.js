const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const images = new Schema({
    img: {data: Buffer, contentType: String}
})

const Images = mongoose.model('Images', images)
module.exports = Images;