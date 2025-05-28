import { Category } from "../category/category";
import { Supplier } from "../supplier/supplier";
import { User } from '../user/user';
export class Review {
  id?: number;
  userId!: number;
  rating!: number;
  text!: string;
  productId!: number;
  userName?: string;
}
