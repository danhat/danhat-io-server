const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
const mongoose = require('mongoose')
const {join} = require('path')
require('dotenv').config()
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const {ApolloServerPluginLandingPageLocalDefault} = require('apollo-server-core');


async function startServer() {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true
  });


  await server.start();

  const app = express();
  
  app.use(graphqlUploadExpress())
  app.use(express.static(join(__dirname, './uploads')))
  

  server.applyMiddleware({app});
  

  mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
  .then( () => {
    console.log('Successfully connected to mongodb')
    return (new Promise(r => app.listen({ port: process.env.PORT || 4000}, r)))
  }).catch(error => {
    console.error(error.message)
  })
  .then((res) => {
    console.log(`Server ready at ${process.env.BASE_URL}${server.graphqlPath}`)
  })


}


startServer();

