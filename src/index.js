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
    post: (_, args, { prisma }) => prisma.link.create({ data: args }),
    delete: (_, { id }, { prisma }) => {
      // let response = '';
      const searchedLink = prisma.link.findUnique({ where: { id } });
      console.log('searchedLink', searchedLink);

      // prisma.link.delete({ where: { id: +id } });
      return `Link with id - ${id} was deleted`;
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
