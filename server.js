const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fakeDatabase = {};

const schema = buildSchema(`
    type Query {
        getInfo: String
    }

    type Mutation {
        setInfo(infoValue: String): String
    }
`);

const rootValue = {
  setInfo: ({ infoValue }) => {
    fakeDatabase.info = infoValue;
    return infoValue;
  },
  getInfo: () => {
    if (!fakeDatabase.info) return 'There is no info';
    return fakeDatabase.info;
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
//     getInfo: String
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
