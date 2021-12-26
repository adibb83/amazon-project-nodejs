import { productDto, productsData } from '../assets/products';

export function getProducts(): productDto[] {
  return productsData;
}

export function getProductsAsync(): Promise<productDto[]> {
  return Promise.resolve(getProducts());
}

export function getProductByIdAsync(id: string): Promise<productDto | undefined> {
  return Promise.resolve(getProducts().find((product) => product.id === id));
}

export function getProductIndexByIdAsync(id: string): Promise<number> {
  return Promise.resolve(getProducts().findIndex((product) => product.id === id));
}
