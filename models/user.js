const mongoose = require('mongoose');
const validator = require('validator');

// Поля схемы user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Артур',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Неверный формат почты'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
