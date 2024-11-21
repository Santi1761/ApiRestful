import express, { Express } from "express";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
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
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      let loggedUser = null;

      // Validar el token si está presente
      if (token) {
        try {
          loggedUser = validateToken(token.replace("Bearer ", ""));
        } catch (error) {
          if (error instanceof Error) {
            console.warn("Error al autenticar el usuario:", error.message);
          } else {
            console.warn("Error al autenticar el usuario:", error);
          }
        }
      }

      return { loggedUser }; // Enviar el usuario autenticado al contexto
    },
  });

  // Iniciar el servidor Apollo
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Middlewares de Express
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ruta de bienvenida
  app.get("/", (_, res) => {
    res.send("Bienvenido al backend GraphQL");
  });

  // Conectar a la base de datos y levantar el servidor
  db.then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`GraphQL listo en http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  }).catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
  });
}

startServer();
