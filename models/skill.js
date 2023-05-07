const {model, Schema} = require('mongoose')
const File = require('../models/file')

const SkillSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  importance: {
    type: Number,
    required: true
  },
  skillType: {
    type: String,
    required: true,
    trim: true
  },
  skillImage: File.schema
})


module.exports = model('Skill', SkillSchema)