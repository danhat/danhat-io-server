import {ApolloServer} from '@apollo/server'
import {expressMiddleware} from '@apollo/server/express4'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import winston from 'winston'
import dotenv from 'dotenv'
(dotenv.config())

import {typeDefs, resolvers} from './schema.js'



const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({all: true})
      )
    }),
    new winston.transports.File({filename: 'error.log', level: 'error'})
  ],
  exceptionHandlers: [
    new winston.transports.File({filename: 'exceptions.log'})
  ]
})


const app = express()

const httpServer = http.createServer(app)

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    console.log('**********************************\n' + 'Request started! Query:\n' + requestContext.request.query);
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        console.log('Parsing started!')
      },
      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log('Validation started!')
      },
    }
  },
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});


await server.start();

app.use(
  '/graphql',
  cors({
    origin: [process.env.DANHAT_URL, "https://studio.apollographql.com"], 
    credentials: true,
  }),
  express.json(),
  graphqlUploadExpress(),
  expressMiddleware(
    server, 
    {
      context: async ({ req }) => ({ 
        token: req.headers.token })
    },
  ),
)


await mongoose.connect(process.env.DATABASE_URL)
.then( () => {
  logger.info('Connected to mongodb atlas')
}).catch(error => {
  logger.error(error.message)
})


await new Promise((resolve) => httpServer.listen({port: process.env.PORT || 4000}, resolve))
logger.info(`Server ready at ${process.env.BASE_URL}${server.graphqlPath}`)





