import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users';
import { productsRouter } from './routes/products';
import { categoriesRouter } from './routes/categories';
import { log } from './middlelware/request-log';
import { AuthBailOut } from './middlelware/auth';
import { logError } from './middlelware/error-handler';

const app = express();
app.use(express.json());
app.use(cors());

app.all('*', (req, res, next) => {
  console.log('Request received', req.url);
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

app.use(log, AuthBailOut);

app.use(logError);

export { app };
