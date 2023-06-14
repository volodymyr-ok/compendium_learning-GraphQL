const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (parent, args, context) => context.prisma.link.findMany(),
  },

  Mutation: {
    post: (_, args, { prisma }) => {
      // return prisma.link.create({ data: args });
      const link = { id: `${links.length++}`, ...args };
      links.push(link);
      return link;
    },
  },
};

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { prisma },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
