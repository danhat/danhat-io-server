const {gql} = require('apollo-server-express')
const File = require('../models/file')


module.exports = gql`

  scalar Upload

  type File {
    id: ID
    filename: String
    mimetype: String
    encoding: String
    url: String
  }


  type Project {
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
  }

  type Skill {
    id: ID
    name: String
    description: String
    importance: String
    type: String
  }

  input SkillInput {
    id: ID
    name: String
    description: String
    importance: String
    type: String
  }


  type Query {
    project(ID: ID!): Project!
    projects: [Project]
    skill(ID: ID!): Skill!
    skills: [Skill]
    files: [File]
  }


  type Mutation{
    createProject(input: ProjectInput!): Project!
    updateProject(ID: ID, input: ProjectInput!): Boolean
    deleteProject(ID: ID!): Boolean
    createSkill(input: SkillInput!): Skill!
    editSkill(ID: ID, input: SkillInput!): Boolean
    deleteSkill(ID: ID!): Boolean
    uploadFile(file: Upload!): File!
    deleteFile(ID: ID!): Boolean
  }
`

