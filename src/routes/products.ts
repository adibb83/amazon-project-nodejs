import { Response, Request, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { productDto } from '../assets/products';
import { checkValidId, checkValidName } from '../validations/common';
import { getProductByIdAsync, getProductIndexByIdAsync, getProducts, getProductsAsync } from '../store/products-store';
import { wrapAsyncAndSend } from '../utils/async-routes';

const PRODUCTS: productDto[] = getProducts();
const productsRouter = Router();

const resolveProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      if (req.params.id) {
        try {
          if (!checkValidId(req.params.id)) {
            res.sendStatus(400);
            return;
          }
          const product = await getProductByIdAsync(req.params.id);
          if (!product) {
            res.sendStatus(404);
            return;
          }
          res.locals.product = product;
        } catch (err) {
          next(err);
        }
      } else {
        try {
          const products = await getProductsAsync();
          res.locals.products = products;
        } catch (err) {
          next(err);
        }
      }
      break;
    case 'POST':
      try {
        const postProduct = req.body as productDto;
        if (!postProduct || !checkValidName(postProduct.name, 3)) {
          res.sendStatus(400);
          return;
        }
        postProduct.id = uuid();
        PRODUCTS.push(postProduct);
      } catch (err) {
        next(err);
      }
      break;
    case 'PUT':
      try {
        if (!checkValidId(req.params.id)) {
          res.sendStatus(400);
          return;
        }
        const putProduct = req.body as productDto;
        if (!putProduct || !checkValidName(putProduct.name, 3)) {
          res.sendStatus(409);
          return;
        }
        putProduct.id = req.params.id;
        res.locals.product = await getProductByIdAsync(req.params.id);
        Object.assign(res.locals.product, req.body, res.locals.product.id);
      } catch (err) {
        next(err);
      }
      break;
    case 'DELETE':
      try {
        if (!checkValidId(req.params.id)) {
          res.sendStatus(500);
          return;
        }
        res.locals.productIndex = getProductIndexByIdAsync(req.params.id);
        PRODUCTS.splice(res.locals.productIndex, 1);
      } catch (err) {
        next(err);
      }
      break;
    default:
      break;
  }
  next();
};

productsRouter.get(
  '/',
  wrapAsyncAndSend(() => getProductsAsync()),
);

productsRouter.get('/:id', resolveProductHandler, (req, res) => {
  res.send(res.locals.product);
});

productsRouter.post('/', resolveProductHandler, (req, res) => {
  res.status(201).send(res.locals.product);
});

productsRouter.put('/:id', resolveProductHandler, (req, res) => {
  res.status(200).send(res.locals.product);
});

productsRouter.delete('/:id', resolveProductHandler, (req, res) => {
  res.sendStatus(204);
});

export { productsRouter };
