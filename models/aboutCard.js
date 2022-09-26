const {model, Schema} = require('mongoose')
const File = require('../models/file')

const AboutCardSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  detail: {
    type: String,
    required: true,
    trim: true
  },
  image: File.schema
})


module.exports = model('AboutCard', AboutCardSchema)