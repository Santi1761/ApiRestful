import express, { Express } from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { db } from "./configs/db";
import typeDefs from "./graphql/schemas/schema";
import resolvers from "./graphql/resolvers/resolvers";
import { validateToken } from "./middlewares/auth";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization || "";
        let loggedUser = null;

        const jwtToken = token.startsWith("Bearer ") ? token.replace("Bearer ", "") : token;

        if (token) {
          try {
            loggedUser = validateToken(jwtToken);
          } catch (error) {
            console.warn("Error al autenticar el usuario:", error);
          }
        }
    
        return { req, res, loggedUser };
      },
    
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_, res) => {
    res.send("Bienvenido al backend GraphQL");
  });

  db.then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`GraphQL listo en http://localhost:${PORT}/graphql`);
    });
  }).catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
  });
}

startServer();
