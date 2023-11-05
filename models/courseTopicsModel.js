const mongoose = require('mongoose');

const courseTopicSchema = new mongoose.Schema({
    categoryName: { type: String, required:true },
    categoryDescribtion: { type: String, required:true },
    categoryImage: { type: String, required:true ,  default: 'uploads/topicImage.png' },
    publishedAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Coursetopics' , courseTopicSchema)