const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    instructor: { type: String, required:true },
    courseTitle: { type: String, required:true },
    courseDescribtion: { type: String, required:true },
    duration: { type: String, required:true },
    certificate: { 
        type: String, 
        required:true,
        enum: {
            values: ['yes', 'no'],
            message: "values must be yes or no only"
          }
    },
    students: { type: Number, required:true },
    lectures: { type: Number, required:true },
    assessments: {
         type: String, 
         required:true,
         enum: {
            values: ['yes', 'no'],
            message: "values must be yes or no only"
        }
},
    coverImage: { type: String, required:true ,  default: 'uploads/coverImage.png' },
    categoryCourse: { type: String, required:true },
    urlVideos: { type: Array, required:true },
    videoIntro: { type: String, required:true },
    publishedAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model('Course' , courseSchema)