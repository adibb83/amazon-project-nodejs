import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users';
import { productsRouter } from './routes/products';
import { categoriesRouter } from './routes/categories';
import { log } from './middlelware/request-log';

const app = express();
app.use(express.json());
app.use(cors());
app.use(log);

app.all('*', (req, res, next) => {
  console.log('Request received', req.url);
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

export { app };
