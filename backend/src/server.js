require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const { GraphQLScalarType, Kind } = require("graphql");

const connectDB = require("./config/db");
const app = require("./app");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/auth");

const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "JSON scalar type",
  parseValue: (value) => value,
  serialize: (value) => value,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) return ast.value;
    if (ast.kind === Kind.OBJECT) return null;
    return null;
  },
});

async function start() {
  await connectDB(process.env.MONGO_URI);

  const server = new ApolloServer({
    typeDefs,
    resolvers: { ...resolvers, JSON: JSONScalar },
    context: ({ req }) => {
      const user = authMiddleware(req); // null or user payload
      return { user, req };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`✅ Server running http://localhost:${port}`);
    console.log(`✅ GraphQL ready http://localhost:${port}/graphql`);
  });
}

start();