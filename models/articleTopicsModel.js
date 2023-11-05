const mongoose = require('mongoose');

const articleTopicSchema = new mongoose.Schema({
    topicName: { type: String, required:true },
    topicDescribtion: { type: String, required:true },
    topicImage: { type: String, required:true ,  default: 'uploads/topicImage.png' },
    publishedAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Articletopics' , articleTopicSchema)