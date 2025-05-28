import { Category } from "../category/category";
import { Supplier } from "../supplier/supplier";
import { Review } from '../review/review';
import { ProductAttribute } from "../product-attribute/product-attribute";

export class Product {
  id?: number;
  supplierId!: number;
  categoryId!: number;
  description!: string;
  name!: string;
  price!: number;
  stock!: number;
  reviews?: Review[];
  averageRating?: number;
  attributes!: ProductAttribute[];
}
