import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv'

import router from './routes/users.Routes';
import { db } from './configs/db' 
import commentRoutes from './routes/comments.Routes'; 

const app: Express = express();
dotenv.config();

const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/users', router);
app.use('/comments', commentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, mundo!');
});

db.then (() => 
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
);