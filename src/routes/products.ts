import { Response, Request, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { productsData, productDto } from '../assets/products';

const PRODUCTS: productDto[] = productsData;
const productsRouter = Router();

const resolveProductByIdHandler = (req: Request, res: Response, next: NextFunction): void => {
  const productId = req.params.id;
  const productIndex = PRODUCTS.findIndex((u) => u.id === productId);

  if (!!!productId || productId.length !== 36) {
    res.sendStatus(400);
    return;
  }

  if (productIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.productIndex = productIndex;
  res.locals.product = PRODUCTS[productIndex];

  next();
};

const resolveProductPutPostHandler = (req: Request, res: Response, next: NextFunction): void => {
  const product = req.body as productDto;

  if (req.method === 'POST') {
    product.id = uuid();
  }

  if (!!!product.id || product.id.length !== 36) {
    res.sendStatus(400);
    return;
  }

  if (product.name.length < 3) {
    res.sendStatus(409);
    return;
  }

  res.locals.product = product;

  next();
};

productsRouter.get('/', (req, res) => {
  res.send(PRODUCTS);
});

productsRouter.get('/:id', resolveProductByIdHandler, (req, res) => {
  res.send(res.locals.product);
});

productsRouter.post('/', resolveProductPutPostHandler, (req, res) => {
  PRODUCTS.push(res.locals.product);
  res.status(201).send(res.locals.product);
});

productsRouter.put('/:id', resolveProductPutPostHandler, (req, res) => {
  Object.assign(res.locals.product, req.body, res.locals.product.id);
  res.status(200).send(res.locals.product);
});

productsRouter.delete('/:id', resolveProductByIdHandler, (req, res) => {
  PRODUCTS.splice(res.locals.productIndex, 1);
  res.sendStatus(204);
});

export { productsRouter };
