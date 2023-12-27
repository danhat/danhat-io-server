import {model, Schema} from 'mongoose'
import File from '../models/file.js'

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


export default model('Info', InfoSchema)