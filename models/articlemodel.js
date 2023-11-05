const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    author: { type: String, required:true },
    articleTitle: { type: String, required:true },
    articleDescribtion: { type: String, required:true },
    coverImage: { type: String, required:true ,  default: 'uploads/coverImage.png' },
    content: { type: String, required:true },
    categoryTopic: { type: String, required:true },
    articleImages: { type: Array, required:true , default: 'uploads/articleImages.png' },
    publishedAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model('Article' , articleSchema)
