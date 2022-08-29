const GraphQLUpload = require('graphql-upload/GraphQLUpload.js')
const { finished } = require('stream/promises')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary')

const Project = require('../models/project')
const Skill = require('../models/skill')
const File = require('../models/file')


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true 
});



module.exports = {
  Upload: GraphQLUpload,

  Query: {
    async project(_, {ID}) {
      return await Project.findById(ID)
    },
    async projects(_, {}) {
      return await Project.find()
    },
    async skills(_, {}) {
      return await Skill.find()
    },
    async files(_, {}) {
      return await File.find()
    }
  },

  Mutation: {    
    
    async createProject(_, {input: {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo}, file}) {

      const {createReadStream, filename, mimetype, encoding} = await file
      const stream = createReadStream()

      const pathName = path.join(__dirname, `../uploads/${filename}`)

      const out = fs.createWriteStream(pathName)
      await stream.pipe(out)
      await finished(out)


      const newFile = new File({
        filename: filename,
        mimetype: mimetype,
        encoding: encoding,
        url: `${process.env.BASE_URL}/${filename}`
      })

      const image = await newFile.save()

      const newProject = new Project({
        title: title,
        language: language,
        description: description,
        importance: importance,
        link: link, 
        demo: demo,
        hasSite: hasSite,
        hasNotebook: hasNotebook,
        hasVideo: hasVideo,
        projectImage: {
          filename: filename,
          mimetype: mimetype,
          encoding: encoding,
          url: `${process.env.BASE_URL}/${filename}`
        }
      })

      const result = await newProject.save()

      return {
        id: result.id,
        ...result._doc
      }
    },

    async updateProject(_, {ID, input: {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo}, file}) {
      if (file != null) {
        const {createReadStream, filename, mimetype, encoding} = await file
        const stream = createReadStream()

        const pathName = path.join(__dirname, `../uploads/${filename}`)

        const out = fs.createWriteStream(pathName)
        await stream.pipe(out)
        await finished(out)
        
        const url = `${process.env.BASE_URL}/${filename}`

        await Project.updateOne({_id: ID}, {projectImage: {filename, mimetype, encoding, url}})
      }
      

      const updatedProject = (await Project.updateOne({_id: ID}, {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo})).modifiedCount
      return updatedProject
    },


    async deleteProject(_, {ID}) {
      const wasDeleted = (await Project.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    },

    async createSkill(_, {input: {name, description, importance, skillType}}) {
      const newSkill = new Skill({
        name: name,
        description: description,
        importance: importance,
        skillType: skillType
      })

      const result = await newSkill.save()

      return {
        id: result.id,
        ...result._doc
      }
    },

    async editSkill(_, {ID, input: {name, description, importance, skillType}}) {
      const editedSkill = (await Skill.updateOne({_id: ID}, {name, description, importance, skillType})).modifiedCount
      return editedSkill

    },


    async deleteSkill(_, {ID}) {
      const wasDeleted = (await Skill.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    },

    
    uploadFile: async (_, {file}) => {
      const {createReadStream, filename, mimetype, encoding} = await file
      const stream = createReadStream()

      const pathName = path.join(__dirname, `../uploads/${filename}`)

      const out = fs.createWriteStream(pathName)
      await stream.pipe(out)
      await finished(out)


      cloudinary.v2.uploader.upload(pathName,
        {public_id: filename, folder: process.env.CLOUDINARY_FOLDER}, 
        function(error, result) {
          console.log(result)
        })

      const newFile = new File({
        filename: filename,
        mimetype: mimetype,
        encoding: encoding,
        url: cloudinary.url(filename)
      })

      const result = await newFile.save()

      return {
        id: result.id,
        ...result._doc
      }

    },
    

    async deleteFile(_, {ID, input: {filename}}) {
      cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${filename}`, function(error,result) {
        console.log(result, error) });
      const wasDeleted = (await File.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    },

  }

}
