const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');


const userSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email address.']
  },
  password: {
    type: String,
    required: true,
    // match: passwordPattern
  },
  phone: {
    type: String,
    required: true,
    match: [/^01[0125][0-9]{8}$/, 'Invalid phone number.']
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: {
      values: ['male', 'female'],
      message: 'Gender must be "male" or "female".'
    }
  },
  token: {
    type: String
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER, userRoles.MANAGER],
    default: userRoles.USER
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // You can add an 'avatar' field if needed with a default value.
  // avatar: {
  //   type: String,
  //   default: 'uploads/profile.png'
  // }
});

module.exports = mongoose.model('User', userSchema);
