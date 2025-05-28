import { ProductAttribute } from "../product-attribute/product-attribute";

export class Product {
  id?: number;
  supplierId!: number;
  categoryId!: number;
  description!: string;
  name!: string;
  price!: number;
  stock!: number;
  attributes!: ProductAttribute[];
}
