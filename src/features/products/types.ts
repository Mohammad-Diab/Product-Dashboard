export type ProductStatus = 'active' | 'inactive';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  createdAt: string;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  status: ProductStatus;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductsResponse = {
  items: Product[];
  nextCursor: string | null;
  hasMore: boolean;
};
