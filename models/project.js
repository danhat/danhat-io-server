const {model, Schema} = require('mongoose')
const File = require('../models/file')


const ProjectSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  language: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  importance: {
    type: Number
  },
  link:{
    type: String,
    trim: true
  },
  demo: {
    type: String,
    trim: true
  },
  hasSite: {
    type: Boolean
  },
  hasNotebook: {
    type: Boolean
  },
  hasVideo: {
    type: Boolean
  },
  projectImage: File.schema
})


module.exports = model('Project', ProjectSchema)