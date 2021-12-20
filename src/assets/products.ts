export interface productDto {
  id: string;
  categoryId: string;
  name: string;
  itemsInStock: number;
}

export const productsData: productDto[] = [
  { id: '6988d561-1742-4f0c-91cc-6919e1b983d2', name: 'Iphone12', categoryId: '6988d561-1742-4f0c-91cc-6919e1b983d2', itemsInStock: 4 },
  { id: 'd1bd7840-4c55-48b5-abce-a55e8b3ff7a4', name: 'onePlus9', categoryId: 'd1bd7840-4c55-48b5-abce-a55e8b3ff7a4', itemsInStock: 14 },
];
