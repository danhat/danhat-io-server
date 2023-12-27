import {model, Schema} from 'mongoose'

const FileSchema = new Schema({
  filename: {
    type: String,
    unique: true,
    trim: true
  },
  url: {
    type: String,
    unique: true
  }
})


export default model('File', FileSchema)


