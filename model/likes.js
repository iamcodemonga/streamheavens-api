const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    poster: { type: String, required: true },
    title: { type: String, required: true },
    released: { type: String, required:true },
    series: Boolean
}, { timestamps: true })

const likes = mongoose.model('likes', likeSchema);

module.exports = likes;