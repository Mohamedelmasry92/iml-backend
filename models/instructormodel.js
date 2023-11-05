const mongoose = require('mongoose');

const instrucorSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        minlength: [2, 'First name is too short.'],
        maxlength: [10, 'First name is too long.']
    },
    lName: {
        type: String,
        required: true,
        minlength: [2, 'Last name is too short.'],
        maxlength: [10, 'Last name is too long.']
    },
    instructorDetails:{type: String, required:true},
    avatar: { type: String, required:true },
    publishedAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model('Instructor' , instrucorSchema)