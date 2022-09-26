const {model, Schema} = require('mongoose')
const File = require('../models/file')

const InfoSchema = new Schema({
  intro: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  about: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  headshot: File.schema,
  cv: File.schema
})


module.exports = model('Info', InfoSchema)