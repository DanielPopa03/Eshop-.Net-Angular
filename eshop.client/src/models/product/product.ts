import { Category } from "../category/category";
import { Supplier } from "../supplier/supplier";

export class Product {
  id?: number;
  supplierId!: number;
  categoryId!: number;
  description!: string;
  name!: string;
  price!: number;
  stock!: number;
}
