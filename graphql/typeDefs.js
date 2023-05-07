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

  type Skill {
    id: ID
    name: String!
    importance: String!
    skillType: String!
    skillImage: File!
  }

  input SkillInput {
    id: ID
    name: String
    importance: String
    skillType: String
    skillImage: FileInput
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

  type AboutCard {
    id: ID
    title: String!
    detail: String!
    image: File
  }

  input AboutCardInput {
    id: ID
    title: String
    detail: String
    image: FileInput
  }


  type Query {
    project(ID: ID!): Project!
    projects: [Project]
    skill(ID: ID!): Skill!
    skills: [Skill]
    file(ID: ID!): File!
    files: [File] 
    infos: [Info]
    aboutCard(ID: ID!): AboutCard!
    aboutCards: [AboutCard]
  }


  type Mutation{
    createProject(input: ProjectInput!, file: Upload!): Project!
    updateProject(ID: ID, input: ProjectInput, file: Upload): Boolean
    deleteProject(ID: ID!): Boolean
    addSkill(input: SkillInput!, file: Upload!): Skill!
    editSkill(ID: ID, input: SkillInput!, file: Upload): Boolean
    deleteSkill(ID: ID!): Boolean
    uploadFile(file: Upload!): File!
    deleteFile(ID: ID!): Boolean
    addInfo(input: InfoInput, file: [Upload]): Info!
    editInfo(ID: ID, input: InfoInput, file: [Upload]): Boolean
    deleteInfo(ID: ID!): Boolean
    addAboutCard(input: AboutCardInput!, file: Upload): AboutCard!
    editAboutCard(ID: ID, input: AboutCardInput, file: Upload): Boolean
    deleteAboutCard(ID: ID!): Boolean
  }
`

