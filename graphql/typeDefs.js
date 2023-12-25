const {gql} = require('apollo-server-express')



module.exports = gql`

  scalar Upload

  type File {
    id: ID
    filename: String
    mimetype: String
    encoding: String
    url: String
  }

  input FileInput {
    id: ID
    filename: String
    mimetype: String
    encoding: String
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

