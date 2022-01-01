import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users';
import { productsRouter } from './routes/products';
import { categoriesRouter } from './routes/categories';
import { AuthBailOut } from './middlelware/auth';
import { errorLogger, traceLogger } from './utils/logger';
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors());

app.use(traceLogger());

app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

app.use(AuthBailOut);
app.use(errorLogger());

export { app };
