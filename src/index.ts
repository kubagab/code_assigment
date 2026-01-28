import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { log } from 'node:console';

const server = new ApolloServer({
    typeDefs,
    resolvers
})

async function startServer() {
    const port = parseInt(process.env.PORT || '4000')
    const {url} = await startStandaloneServer(server, {
        listen: {port: port}
    })
    console.log("server running on port: ", port);
    
}

startServer()