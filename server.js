const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fakeDatabase = {};

const schema = buildSchema(`
    input CommentInput {
        author: String
        content: String
    }

    type Comment {
        id: ID!
        author: String
        content: String
    }  

    type Query {
        getComment(id: ID!): Comment
        getAllComments: [Comment]
    }

    type Mutation {
        createComment(input: CommentInput): Comment
        updateComment(id: ID!,  input: CommentInput): Comment
    }
`);

class Comment {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

const rootValue = {
  getComment: ({ id }) => {
    if (!fakeDatabase[id]) throw new Error('no comments exists with id ' + id);
    return new Comment(id, fakeDatabase[id]);
  },

  createComment: ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Comment(id, input);
  },

  updateComment: ({ id, input }) => {
    if (!fakeDatabase[id]) throw new Error('no comments exists with id ' + id);

    fakeDatabase[id] = input;
    return new Comment(id, input);
  },

  getAllComments: () => {
    return Object.keys(fakeDatabase).map(key => {
      return new Comment(key, fakeDatabase[key]);
    });
  },
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

// app.use(() => {
//   console.log(fakeDatabase);
// });

app.listen(4000);
console.log('listening on http://localhost:4000/graphql');

// ----------------------------------------------------------------
// class RandomDie {
//   constructor(numSides) {
//     this.numSides = numSides;
//   }
//   rollOnce() {
//     return 1 + Math.floor(Math.random() * this.numSides);
//   }
//   roll({ numRolls }) {
//     const output = [];
//     for (let i = 0; i < numRolls; i++) {
//       output.push(this.rollOnce());
//     }
//     return output;
//   }
// }
// class User {
//   constructor(name) {
//     this.name = name;
//   }
//   age() {
//     return Math.floor(Math.random() * 100);
//   }
// }
// const getDie = ({ numSides }) => {
//   return new RandomDie(numSides);
// };
// ---------------- RESLOVERS ----------------
//   greetings: 'Hellow world!',
//   test: ({ text }) => text,
//   user: args => new User(args.name),
//   getDie,
// ---------------- SCHEMAS ----------------
// type Query {
//     greetings: String
//     test(text: String = "Static test TEXT"): String
//     user(name: String = "No Name"): User
//     getDie(numSides: Int = 6): RandomDie
//     getComment: String
// }
// type User {
//     name: String
//     age: Int
// }
// type RandomDie {
//     roll(numRolls: Int!): [Int]
//     rollOnce: Int
//     numSides: Int
// }
