import { productDto } from '../assets/products';
import { getProducts } from '../store/products-store';
import { CategoriesData, CategoryDto } from '../assets/categories';

export function getCategories(): CategoryDto[] {
  return CategoriesData;
}

export function getCategoriesAsync(): Promise<CategoryDto[]> {
  return Promise.resolve(getCategories());
}

export function getCategoryByIdAsync(id: string): Promise<CategoryDto | undefined> {
  return Promise.resolve(getCategories().find((Category) => Category.id === id));
}

export function getCategoryIndexByIdAsync(id: string): Promise<number> {
  return Promise.resolve(getCategories().findIndex((Category) => Category.id === id));
}

export function getProductsByCategoryId(categoryId: string): Promise<productDto[]> {
  return Promise.resolve(getProducts().filter((product) => product.categoryId === categoryId));
}
