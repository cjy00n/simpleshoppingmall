import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";
import { DBfield, readDB } from "./dbController";

(async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
      db: {
        products: readDB(DBfield.PRODUCTS),
        cart: readDB(DBfield.CART),
      },
    },
  });

  const app = express();
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      origin: ["http://localhost:5173", "https://studio.apollographql.com"],
      credentials: true,
    },
  });
  await app.listen({ port: 8000 });
  console.log("server listing on 8000");
})();
