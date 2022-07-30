const {model, Schema} = require('mongoose')

const SkillSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  importance: {
    type: Number
  },
  type: {
    type: String
  }
})


module.exports = model('Skill', SkillSchema)