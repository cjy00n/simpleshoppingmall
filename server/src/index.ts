import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";

(async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    // context:{

    // }
  });

  const app = express();
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      origin: [
        "http://localhost:5173",
        "https://studio.apploservergraphql.com",
      ],
      credentials: true,
    },
  });
  await app.listen({ port: 8000 });
  console.log("server listing on 8000");
})();
