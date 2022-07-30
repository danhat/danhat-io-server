const {model, Schema} = require('mongoose')

const FileSchema = new Schema({
  filename: {
    type: String
  },
  mimetype: {
    type: String
  },
  encoding: {
    type: String
  },
  url: {
    type: String
  }
})


module.exports = model('File', FileSchema)


