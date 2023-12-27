import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import { finished } from 'stream/promises'
import path from 'path'
import fs from 'fs'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
(dotenv.config())

import Project from './models/project.js'
import File from './models/file.js'
import Info from './models/info.js'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true 
});


export const typeDefs = `#graphql

scalar Upload

type File {
  id: ID
  filename: String
  url: String
}

input FileInput {
  id: ID
  filename: String
  url: String
}


type Project {
  id: ID
  title: String!
  language: String
  description: String
  importance: String!
  link: String!
  demo: String!
  hasSite: String!
  hasNotebook: String!
  hasVideo: String!
  tags: [String]!
  projectImage: File!
}

input ProjectInput {
  id: ID
  title: String
  language: String
  description: String
  importance: String
  link: String
  demo: String
  hasSite: String
  hasNotebook: String
  hasVideo: String
  tags: [String]!
  projectImage: FileInput
}

type Info {
  id: ID
  intro: String!
  about: String
  headshot: File
  cv: File
}

input InfoInput {
  id: ID
  intro: String
  about: String
  headshot: FileInput
  cv: FileInput
}



type Query {
  project(ID: ID!): Project!
  projects: [Project]
  file(ID: ID!): File!
  files: [File] 
  infos: [Info]
}


type Mutation{
  createProject(input: ProjectInput!, file: Upload!): Project!
  updateProject(ID: ID, input: ProjectInput, file: Upload): Boolean
  deleteProject(ID: ID!): Boolean
  uploadFile(file: Upload!): File!
  deleteFile(ID: ID!): Boolean
  addInfo(input: InfoInput, file: [Upload]): Info!
  editInfo(ID: ID, input: InfoInput, file: [Upload]): Boolean
  deleteInfo(ID: ID!): Boolean
}
`



export const resolvers = {

  Upload: GraphQLUpload,

  Query: {
    async project(_, {ID}) {
      return await Project.findById(ID)
    },
    async projects(_, {}) {
      return await Project.find()
    },
    async file(_, {ID}) {
      return await File.findById(ID)
    },
    async files(_, {}) {
      return await File.find()
    },
    // async info(_, {Name}) {
    //   return await Info.findOne({'name': Name})
    // },
    async infos(_, {}) {
      return await Info.find()
    },
  },

  Mutation: {    
    
    async createProject(_, {input: {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo, tags}, file}) {

      const {createReadStream, filename, mimetype, encoding} = await file
      const stream = createReadStream()

      const __dirname = path.dirname(filename);
      const pathName = path.join(__dirname, `./uploads/${filename}`)

      const out = fs.createWriteStream(pathName)
      await stream.pipe(out)
      await finished(out)

      const strippedFilename = filename.substr(0, filename.lastIndexOf('.'))

      cloudinary.v2.uploader.upload(pathName,
        {public_id: strippedFilename, folder: process.env.CLOUDINARY_FOLDER}, 
        function(error, result) {
          console.log(result, error)
        })

      const new_url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${process.env.CLOUDINARY_FOLDER}/${strippedFilename}`
      const newFile = new File({
        filename: strippedFilename,
        url: new_url
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
        tags: tags,
        projectImage: image
      })

      const result = await newProject.save()

      return {
        id: result.id,
        ...result._doc
      }
    },



    async updateProject(_, {ID, input: {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo, tags}, file}) {
      if (file != null) {
        // delete from cloudinary
        const toDelete = (await Project.findById(ID)).projectImage
        cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${toDelete.filename}`, function(error,result) {
          console.log(result, error) });
        (await File.deleteOne({_id: toDelete.id}))
        
        const {createReadStream, filename, mimetype, encoding} = await file
        const stream = createReadStream()

        const __dirname = path.dirname(filename);
        const pathName = path.join(__dirname, `./uploads/${filename}`)

        const out = fs.createWriteStream(pathName)
        await stream.pipe(out)
        await finished(out)

        const strippedFilename = filename.substr(0, filename.lastIndexOf('.'))

        cloudinary.v2.uploader.upload(pathName,
          {public_id: strippedFilename, folder: process.env.CLOUDINARY_FOLDER}, 
          function(error, result) {
            console.log(result, error)
          })
        
        const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${process.env.CLOUDINARY_FOLDER}/${strippedFilename}`

        await Project.updateOne({_id: ID}, {projectImage: {strippedFilename,  url}})
      }

      const updatedProject = (await Project.updateOne({_id: ID}, {title, language, description, importance, link, demo, hasSite, hasNotebook, hasVideo, tags})).modifiedCount
      return updatedProject
    },




    async deleteProject(_, {ID}) {
      const toDelete = (await Project.findById(ID)).projectImage
      cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${toDelete.filename}`, function(error,result) {
        console.log(result, error) });

      (await File.deleteOne({_id: toDelete.id}))

      const wasDeleted = (await Project.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    },


    async addInfo(_, {input: {intro, about}, file}) {
      let savedFiles = {}

      for (let i = 0; i < file.length; i++) {
        const {createReadStream, filename, mimetype, encoding} = await file[i]
        const stream = createReadStream()

        const __dirname = path.dirname(filename);
        const pathName = path.join(__dirname, `./uploads/${filename}`)

        const out = fs.createWriteStream(pathName)
        await stream.pipe(out)
        await finished(out)

        const strippedFilename = filename.substr(0, filename.lastIndexOf('.'))

        cloudinary.v2.uploader.upload(pathName,
          {public_id: strippedFilename, folder: process.env.CLOUDINARY_FOLDER}, 
          function(error, result) {
            console.log(result, error)
          })

        let new_url 
        if (mimetype == 'application/pdf') 
          new_url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/fl_attachment/${process.env.CLOUDINARY_FOLDER}/${strippedFilename}`
        else
          new_url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${process.env.CLOUDINARY_FOLDER}/${strippedFilename}`
          
        const newFile = new File({
          filename: strippedFilename,
          url: new_url
        })

        const fileToSave = await newFile.save()
        savedFiles[strippedFilename] = await fileToSave
      }
      


      const newInfo = new Info({
        intro: intro,
        about: about,
        headshot: savedFiles['headshot'],
        cv: savedFiles['cv']
      })

      const result = await newInfo.save()

      return {
        id: result.id,
        ...result._doc
      }
    },




    async editInfo(_, {ID, input: {intro, about}, file}) {


      ///**********
      ///finish edit files
      ///*******************
      if (file != null) {
        // delete from cloudinary
        const toDelete = (await Info.findById(ID)).file
        cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${toDelete.filename}`, function(error,result) {
          console.log(result, error) });
        //(await File.deleteOne({_id: toDelete.id}))
        
        const {createReadStream, filename, mimetype, encoding} = await file
        const stream = createReadStream()

        const __dirname = path.dirname(filename);
        const pathName = path.join(__dirname, `./uploads/${filename}`)

        const out = fs.createWriteStream(pathName)
        await stream.pipe(out)
        await finished(out)

        const strippedFilename = filename.substr(0, filename.lastIndexOf('.'))

        cloudinary.v2.uploader.upload(pathName,
          {public_id: strippedFilename, folder: process.env.CLOUDINARY_FOLDER}, 
          function(error, result) {
            console.log(result, error)
          })
        
        const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${process.env.CLOUDINARY_FOLDER}/${strippedFilename}`

        await Info.updateOne({_id: ID}, {file: {strippedFilename, url}})

      }

      const updatedInfo = (await Info.updateOne({_id: ID}, {intro, about})).modifiedCount
      return updatedInfo
    },




    async deleteInfo(_, {ID}) {

      const toDelete = (await Info.findById(ID))

      if (toDelete.headshot != null) {
        cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${toDelete.headshot.filename}`, function(error,result) {
          console.log(result, error) });
  
        (await File.deleteOne({_id: toDelete.headshot.id}))
      }

      if (toDelete.cv != null) {
        cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${toDelete.cv.filename}`, function(error,result) {
          console.log(result, error) });
  
        (await File.deleteOne({_id: toDelete.cv.id}))
      }

      // const toDelete2 = (await Info.findById(ID)).file
      // cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${toDelete.filename}`, function(error,result) {
      //   console.log(result, error) });

      // (await File.deleteOne({_id: toDelete.id}))

      const wasDeleted = (await Info.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    },

    
    uploadFile: async (_, {file}) => {
      const {createReadStream, filename, mimetype, encoding} = await file
      const stream = createReadStream()

      const __dirname = path.dirname(filename);
      const pathName = path.join(__dirname, `../uploads/${filename}`)

      const out = fs.createWriteStream(pathName)
      await stream.pipe(out)
      await finished(out)

      const strippedFilename = filename.substr(0, filename.lastIndexOf('.'))
      cloudinary.v2.uploader.upload(pathName,
        {public_id: strippedFilename, folder: process.env.CLOUDINARY_FOLDER}, 
        function(error, result) {
          console.log(result, error)
        })

      const new_url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${process.env.CLOUDINARY_FOLDER}/${strippedFilename}`
      const newFile = new File({
        filename: strippedFilename,
        url: new_url
      })

      const result = await newFile.save()

      return {
        id: result.id,
        ...result._doc
      }

    },
    


    async deleteFile(_, {ID}) {  
      const toDelete = await File.findById(ID)
      cloudinary.v2.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${toDelete.filename}`, function(error,result) {
        console.log(result, error) });
      const wasDeleted = (await File.deleteOne({_id: ID})).deletedCount
      return wasDeleted
    },

  }
}






