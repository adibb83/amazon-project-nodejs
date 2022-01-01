import { Response, Request, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { productDto } from '../assets/products';
import { checkValidId, checkValidName, editProductSchma, idValidator, newProductSchma } from '../validations/common';
import { getProductByIdAsync, getProductIndexByIdAsync, getProducts, getProductsAsync } from '../store/products-store';
import { wrapAsyncAndSend } from '../utils/async-routes';
import { createLogger } from '../utils/logger';

const logger = createLogger('Products');
const PRODUCTS: productDto[] = getProducts();
const productsRouter = Router();

const resolveProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      if (req.params.id) {
        try {
          const productId = await idValidator.validateAsync(req.params.id);
          const product = await getProductByIdAsync(productId);
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
        const postProduct = await newProductSchma.validateAsync(req.body);
        postProduct.id = uuid();
        res.locals.product = postProduct;
        PRODUCTS.push(postProduct);
      } catch (err) {
        next(err);
      }
      break;
    case 'PUT':
      try {
        const putProduct = await editProductSchma.validateAsync(req.body);
        res.locals.product = await getProductByIdAsync(putProduct.id);
        Object.assign(res.locals.product, req.body, res.locals.product.id);
      } catch (err) {
        next(err);
      }
      break;
    case 'DELETE':
      try {
        const productId = await idValidator.validateAsync(req.params.id);
        res.locals.productIndex = getProductIndexByIdAsync(productId);
        res.locals.product = PRODUCTS[res.locals.productIndex];
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
  logger.info(`Product ${res.locals.product.id} was Requested`);
  res.send(res.locals.product);
});

productsRouter.post('/', resolveProductHandler, (req, res) => {
  logger.info(`Product ${res.locals.product.id} was created`);
  res.status(201).send(res.locals.product);
});

productsRouter.put('/:id', resolveProductHandler, (req, res) => {
  logger.info(`Product ${res.locals.product.id} was updated`);
  res.status(200).send(res.locals.product);
});

productsRouter.delete('/:id', resolveProductHandler, (req, res) => {
  logger.info(`Product ${res.locals.product.id} was deleted`);
  res.sendStatus(204);
});

export { productsRouter };
