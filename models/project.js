const {model, Schema} = require('mongoose')
const File = require('../models/file')


const ProjectSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  language: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  importance: {
    type: Number,
    required: true
  },
  link:{
    type: String,
    required: true,
    trim: true
  },
  demo: {
    type: String,
    required: true,
    trim: true
  },
  hasSite: {
    type: Boolean,
    required: true
  },
  hasNotebook: {
    type: Boolean,
    required: true
  },
  hasVideo: {
    type: Boolean,
    required: true
  },
  tags: [String],
  projectImage: File.schema
})


module.exports = model('Project', ProjectSchema)