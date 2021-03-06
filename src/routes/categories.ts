import { Response, Request, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { CategoryDto } from '../assets/categories';
import { wrapAsyncAndSend } from '../utils/async-routes';
import {
  getCategoriesAsync,
  getCategories,
  getCategoryByIdAsync,
  getCategoryIndexByIdAsync,
  getProductsByCategoryId,
} from '../store/category-store';
import { checkValidId, checkValidName, editCategorySchma, idValidator, newCategorySchma } from '../validations/common';
import { productDto } from '../assets/products';

const CATEGORIES: CategoryDto[] = getCategories();
const categoriesRouter = Router();

const resolveProductsByCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.params.id;
  if (!checkValidId(categoryId)) {
    res.sendStatus(400);
    return;
  }
  const productsRes: productDto[] = await getProductsByCategoryId(categoryId);
  res.locals.products = productsRes;
  next();
};

const resolveCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      if (req.params.id) {
        try {
          const categoryId = await idValidator.validateAsync(req.params.id);
          const category = await getCategoryByIdAsync(categoryId);
          if (!category) {
            res.sendStatus(404);
            return;
          }
          res.locals.category = category;
        } catch (err) {
          next(err);
        }
      } else {
        try {
          const categories = await getCategoriesAsync();
          res.locals.categories = categories;
        } catch (err) {
          next(err);
        }
      }
      break;
    case 'POST':
      try {
        const postCategory = await newCategorySchma.validateAsync(req.body);
        postCategory.id = uuid();
        res.locals.category = postCategory;
        CATEGORIES.push(postCategory);
      } catch (err) {
        next(err);
      }
      break;
    case 'PUT':
      try {
        const putCategory = await editCategorySchma.validateAsync(req.body);
        res.locals.category = await getCategoryByIdAsync(putCategory.id);
        Object.assign(res.locals.category, req.body, res.locals.category.id);
      } catch (err) {
        next(err);
      }
      break;
    case 'DELETE':
      try {
        const categoryId = await idValidator.validateAsync(req.params.id);
        res.locals.categoryIndex = await getCategoryIndexByIdAsync(categoryId);
        CATEGORIES.splice(res.locals.categoryIndex, 1);
      } catch (err) {
        next(err);
      }
      break;
    default:
      break;
  }
  next();
};

categoriesRouter.get(
  '/',
  wrapAsyncAndSend(() => getCategoriesAsync()),
);

categoriesRouter.get('/:id', resolveCategoryHandler, (req, res) => {
  res.send(res.locals.category);
});

categoriesRouter.get('/:id/productes', resolveProductsByCategoryHandler, (req, res) => {
  res.send(res.locals.products);
});

categoriesRouter.post('/', resolveCategoryHandler, (req, res) => {
  res.status(201).send(res.locals.category);
});

categoriesRouter.put('/:id', resolveCategoryHandler, (req, res) => {
  res.status(200).send(res.locals.category);
});

categoriesRouter.delete('/:id', resolveCategoryHandler, (req, res) => {
  res.sendStatus(204);
});

export { categoriesRouter };
