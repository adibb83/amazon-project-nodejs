import joi from 'joi';

export const idValidator = joi.string().length(36);

export const newUserSchma = joi.object().keys({
  id: joi.forbidden(),
  name: joi.string().required().min(3),
  age: joi.number().optional().positive(),
});

export const editUserSchma = joi.object().keys({
  id: idValidator,
  name: joi.string().required().min(3),
  age: joi.number().optional().positive(),
});

export const newProductSchma = joi.object().keys({
  id: joi.forbidden(),
  name: joi.string().required().min(3),
  categoryId: joi.string().required().length(36),
  itemsInStock: joi.number().required().min(0),
});

export const editProductSchma = joi.object().keys({
  id: idValidator,
  name: joi.string().required().min(3),
  categoryId: joi.string().required().length(36),
  itemsInStock: joi.number().required().min(0),
});

export const newCategorySchma = joi.object().keys({
  id: joi.forbidden(),
  name: joi.string().required().min(3),
});

export const editCategorySchma = joi.object().keys({
  id: idValidator,
  name: joi.string().required().min(3),
});

export function checkValidId(id: string): boolean {
  if (!!!id || id.length !== 36) {
    return false;
  }
  return true;
}

export function checkValidName(name: string, length: number): boolean {
  if (!!!name || name.length < length) {
    return false;
  }
  return true;
}
