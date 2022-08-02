const {gql} = require('apollo-server-express')



module.exports = gql`

  scalar Upload

  type File {
    id: ID!
    filename: String
    mimetype: String
    encoding: String
    url: String
  }

  input FileInput {
    id: ID!
    filename: String
    mimetype: String
    encoding: String
    url: String
  }


  type Project {
    id: ID!
    title: String!
    language: String
    description: String
    importance: String!
    link: String!
    demo: String!
    hasSite: String!
    hasNotebook: String!
    hasVideo: String!
    projectImage: File!
  }

  input ProjectInput {
    id: ID!
    title: String!
    language: String
    description: String
    importance: String!
    link: String!
    demo: String!
    hasSite: String!
    hasNotebook: String!
    hasVideo: String!
    projectImage: File!
  }

  type Skill {
    id: ID!
    name: String!
    importance: String!
    type: String!
  }

  input SkillInput {
    id: ID!
    name: String!
    importance: String!
    type: String!
  }


  type Query {
    project(ID: ID!): Project!
    projects: [Project]
    skill(ID: ID!): Skill!
    skills: [Skill]
    file(ID: ID!): File!
    files: [File] 
  }


  type Mutation{
    createProject(input: ProjectInput!, file: Upload!): Project!
    updateProject(ID: ID, input: ProjectInput, file: Upload): Boolean
    deleteProject(ID: ID!): Boolean
    createSkill(input: SkillInput!): Skill!
    editSkill(ID: ID, input: SkillInput!): Boolean
    deleteSkill(ID: ID!): Boolean
    uploadFile(file: Upload!): File!
    deleteFile(ID: ID!): Boolean
  }
`

