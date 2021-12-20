import { Response, Request, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { CategoriesData, CategoryDto } from '../assets/categories';
import { productsData, productDto } from '../assets/products';

const categories: CategoryDto[] = CategoriesData;
const products: productDto[] = productsData;
const categoriesRouter = Router();

const resolvecategoryByIdHandler = (req: Request, res: Response, next: NextFunction): void => {
  const categoryId = req.params.id;
  const categoryIndex = categories.findIndex((u) => u.id === categoryId);

  if (!!categoryId || categoryId.length !== 36) {
    res.sendStatus(400);
    return;
  }

  if (categoryIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.categoryIndex = categoryIndex;
  res.locals.category = categories[categoryIndex];

  next();
};

const resolveCategoryPutPostHandler = (req: Request, res: Response, next: NextFunction): void => {
  const category = req.body as CategoryDto;

  if (req.method === 'POST') {
    category.id = uuid();
  }

  if (!!category.id || category.id.length !== 36) {
    res.sendStatus(400);
    return;
  }

  if (category.name.length < 3) {
    res.sendStatus(409);
    return;
  }

  res.locals.category = category;

  next();
};

const resolveProductsByCategoryHandler = (req: Request, res: Response, next: NextFunction): void => {
  const categoryId = req.params.id;
  if (!!!categoryId || categoryId.length !== 36) {
    console.log(categoryId, categoryId.length);
    res.sendStatus(400);
    return;
  }

  const productsRes: productDto[] = products.filter((p) => p.categoryId === categoryId);

  res.locals.products = productsRes;

  next();
};

categoriesRouter.get('/', (req, res) => {
  res.send(categories);
});

categoriesRouter.get('/:id', resolvecategoryByIdHandler, (req, res) => {
  res.send(res.locals.category);
});

categoriesRouter.get('/:id/productes', resolveProductsByCategoryHandler, (req, res) => {
  res.send(res.locals.products);
});

categoriesRouter.post('/', resolveCategoryPutPostHandler, (req, res) => {
  categories.push(res.locals.category);
  res.status(201).send(res.locals.category);
});

categoriesRouter.put('/:id', resolveCategoryPutPostHandler, (req, res) => {
  Object.assign(res.locals.category, req.body, res.locals.category.id);
  res.status(200).send(res.locals.category);
});

categoriesRouter.delete('/:id', resolvecategoryByIdHandler, (req, res) => {
  categories.splice(res.locals.categoryIndex, 1);
  res.sendStatus(204);
});

export { categoriesRouter };
