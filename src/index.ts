import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';

import router from './routes/users.Routes';
import commentRoutes from './routes/comments.Routes';
import { schema } from './graphql/schema';
import { db } from './configs/db';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas REST
app.use('/api/users', router);
app.use('/comments', commentRoutes);

// Ruta raíz para probar REST
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, mundo!');
});

// Configuración de Apollo Server para GraphQL
const startApolloServer = async () => {
  const apolloServer = new ApolloServer({
    schema,
    introspection: true, // Habilita introspección en desarrollo
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app }); // Vincula GraphQL a Express

  console.log(`GraphQL is running at http://localhost:${PORT}${apolloServer.graphqlPath}`);
};

// Conexión a la base de datos y levantamiento del servidor
db.then(() => {
  startApolloServer(); // Inicia Apollo Server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
