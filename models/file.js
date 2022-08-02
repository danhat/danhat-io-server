const {model, Schema} = require('mongoose')

const FileSchema = new Schema({
  filename: {
    type: String,
    unique: true,
    trim: true
  },
  mimetype: {
    type: String
  },
  encoding: {
    type: String
  },
  url: {
    type: String,
    unique: true
  }
})


module.exports = model('File', FileSchema)


