const {gql} = require('apollo-server');
const Project = require('../models/project');
const Skill = require('../models/skill');


module.exports = {

  Query: {
    async project(_, {ID}) {
      return await Project.findById(ID)
    },
    async projects(_, {}) {
      return await Project.find()
    },
    async skills(_, {}) {
      return await Skill.find()
    }
  },

  Mutation: {
    async createProject(_, {input: {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo}}) {
      const newProject = new Project({
        title: title,
        language: language,
        description: description,
        importance: importance,
        link: link, 
        demo: demo,
        hasSite: hasSite,
        hasNotebook: hasNotebook,
        hasVideo: hasVideo
      })

      const result = await newProject.save()

      return {
        id: result.id,
        ...result._doc
      }
    },

    async updateProject(_, {ID, input: {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo}}) {
      const updatedProject = (await Project.updateOne({_id: ID}, {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo})).modifiedCount
      return updatedProject

    },


    async deleteProject(_, {ID}) {
      const wasDeleted = (await Project.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    },

    async createSkill(_, {input: {name, description, importance, type}}) {
      const newSkill = new Skill({
        name: name,
        description: description,
        importance: importance,
        type: type
      })

      const result = await newSkill.save()

      return {
        id: result.id,
        ...result._doc
      }
    },

    async editSkill(_, {ID, input: {name, description, importance, type}}) {
      const editedSkill = (await Skill.updateOne({_id: ID}, {name, description, importance, type})).modifiedCount
      return editedSkill

    },


    async deleteSkill(_, {ID}) {
      const wasDeleted = (await Skill.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    }
  }

}
