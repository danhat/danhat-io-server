const {ApolloServer, gql} = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')



const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded'
})

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
  .then( () => {
    console.log('Successfully connected to mongodb')
    return server.listen({port: 4000})
  }).catch(error => {
    console.error(error.message)
  })
  .then((res) => {
    console.log(`Server is ready at ${res.url}`)
  })









