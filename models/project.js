import {model, Schema} from 'mongoose'
import File from '../models/file.js'


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


export default model('Project', ProjectSchema)