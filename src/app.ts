import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users';
import { productsRouter } from './routes/products';
import { categoriesRouter } from './routes/categories';
import { loggerOptions } from './middlelware/request-log';
import { AuthBailOut } from './middlelware/auth';
import expresswinston from 'express-winston';

const app = express();
app.use(express.json());
app.use(cors());

app.use(expresswinston.logger(loggerOptions()));

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

app.use(AuthBailOut);

app.use(expresswinston.errorLogger(loggerOptions()));

export { app };
