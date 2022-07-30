const {model, Schema} = require('mongoose')


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
  }
})


module.exports = model('Project', ProjectSchema)