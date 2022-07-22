const {gql} = require('apollo-server')



module.exports = gql`
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
  }


  type Mutation{
    createProject(input: ProjectInput!): Project!
    updateProject(ID: ID, input: ProjectInput!): Boolean
    deleteProject(ID: ID!): Boolean
    createSkill(input: SkillInput!): Skill!
    editSkill(ID: ID, input: SkillInput!): Boolean
    deleteSkill(ID: ID!): Boolean
  }
`

